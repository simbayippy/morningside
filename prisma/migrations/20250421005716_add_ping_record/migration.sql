-- CreateTable
CREATE TABLE "PingRecord" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT,

    CONSTRAINT "PingRecord_pkey" PRIMARY KEY ("id")
);
