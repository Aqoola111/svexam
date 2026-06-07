-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(20) NOT NULL,
    "genre" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Movie_title_idx" ON "Movie"("title");

-- CreateIndex
CREATE INDEX "Movie_createdAt_idx" ON "Movie"("createdAt");
