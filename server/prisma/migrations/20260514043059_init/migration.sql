-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "desc" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "hue" INTEGER NOT NULL,
    "sizes" TEXT,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);
