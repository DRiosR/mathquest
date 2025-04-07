/*
  Warnings:

  - Added the required column `nivel` to the `nivel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nivel" ADD COLUMN     "nivel" INTEGER NOT NULL;
