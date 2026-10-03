import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectSequenceType } from "@/lib/sequence";

const allowedPasteTypes = [
  "DNA",
  "RNA",
  "PROTEIN",
  "FASTA",
  "VCF",
  "CODE",
  "TEXT",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      content,
      pasteType = "TEXT",
      expiresAt,
      maxViews,
    } = body;

    const detectedType =
  pasteType === "TEXT"
    ? detectSequenceType(content)
    : null;

const finalPasteType = detectedType || pasteType;

    // Validate content
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    // Validate paste type
    if (!allowedPasteTypes.includes(finalPasteType)) {
      return NextResponse.json(
        { error: "Invalid paste type." },
        { status: 400 }
      );
    }

    // Validate max views
    if (
      maxViews !== undefined &&
      maxViews !== null &&
      (!Number.isInteger(maxViews) || maxViews <= 0)
    ) {
      return NextResponse.json(
        { error: "maxViews must be a positive integer." },
        { status: 400 }
      );
    }

    // Validate expiration date
    let expirationDate: Date | null = null;

    if (expiresAt) {
      expirationDate = new Date(expiresAt);

      if (isNaN(expirationDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date." },
          { status: 400 }
        );
      }

      if (expirationDate <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future." },
          { status: 400 }
        );
      }
    }

    // Create paste
    const paste = await prisma.bioPaste.create({
      data: {
        title: title || null,
        content,
        pasteType: finalPasteType,
        expiresAt: expirationDate,
        maxViews: maxViews ?? null,
      },
    });

    return NextResponse.json(
      {
        id: paste.id,
        url: `/p/${paste.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create paste error:", error);

    return NextResponse.json(
      { error: "Failed to create paste." },
      { status: 500 }
    );
  }
}

