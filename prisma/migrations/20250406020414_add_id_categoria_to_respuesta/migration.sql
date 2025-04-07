/*
  Warnings:

  - Added the required column `idCategoria` to the `respuesta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "respuesta" ADD COLUMN     "idCategoria" TEXT NOT NULL;
