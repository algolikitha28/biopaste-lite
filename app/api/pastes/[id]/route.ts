import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeSequence } from "@/lib/sequence";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const paste = await prisma.bioPaste.findUnique({
      where: {
        id,
      },
    });

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found." },
        { status: 404 }
      );
    }

    if (paste.expiresAt && paste.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "Paste has expired." },
        { status: 410 }
      );
    }

    if (
      paste.maxViews !== null &&
      paste.viewCount >= paste.maxViews
    ) {
      return NextResponse.json(
        { error: "Paste has reached its maximum view limit." },
        { status: 410 }
      );
    }

    const updatedPaste = await prisma.bioPaste.update({
      where: {
        id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    const sequenceData =
      updatedPaste.pasteType === "DNA" ||
      updatedPaste.pasteType === "RNA" ||
      updatedPaste.pasteType === "FASTA"
        ? analyzeSequence(updatedPaste.content)
        : null;

    return NextResponse.json({
      id: updatedPaste.id,
      title: updatedPaste.title,
      content: updatedPaste.content,
      pasteType: updatedPaste.pasteType,
      createdAt: updatedPaste.createdAt,
      expiresAt: updatedPaste.expiresAt,
      maxViews: updatedPaste.maxViews,
      viewCount: updatedPaste.viewCount,
      sequenceData,
    });
  } catch (error) {
    console.error("Get paste error:", error);

    return NextResponse.json(
      { error: "Failed to retrieve paste." },
      { status: 500 }
    );
  }
}