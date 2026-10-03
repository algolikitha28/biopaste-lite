-- CreateTable
CREATE TABLE "BioPaste" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "pasteType" TEXT NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "maxViews" INTEGER,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BioPaste_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BioPaste_expiresAt_idx" ON "BioPaste"("expiresAt");
