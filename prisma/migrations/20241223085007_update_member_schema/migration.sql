/*
  Warnings:

  - Added the required column `studentIdImage` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Made the column `salutation` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `class` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `faculty` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `major` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cusid` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "studentIdImage" TEXT NOT NULL,
ALTER COLUMN "salutation" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "class" SET NOT NULL,
ALTER COLUMN "faculty" SET NOT NULL,
ALTER COLUMN "major" SET NOT NULL,
ALTER COLUMN "cusid" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
