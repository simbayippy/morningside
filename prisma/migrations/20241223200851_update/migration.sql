/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `graduationYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "graduationYear",
DROP COLUMN "major";
