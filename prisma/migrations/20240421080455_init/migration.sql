/*
  Warnings:

  - Added the required column `asset` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datetime` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "asset" TEXT NOT NULL,
ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL;
