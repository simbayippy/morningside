-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('STUDENT', 'ORDINARY_II', 'ORDINARY_I', 'HONORARY');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipType" "MembershipType" NOT NULL,
    "membershipFee" DECIMAL(65,30),
    "transactionDate" TIMESTAMP(3),
    "dateOfRegistration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salutation" TEXT,
    "englishName" TEXT NOT NULL,
    "preferredName" TEXT,
    "chineseName" TEXT,
    "gender" TEXT,
    "class" TEXT,
    "faculty" TEXT,
    "major" TEXT,
    "cusid" TEXT,
    "employer" TEXT,
    "position" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
