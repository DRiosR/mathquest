/*
  Warnings:

  - You are about to drop the column `respuestaUsuario` on the `respuesta` table. All the data in the column will be lost.
  - Added the required column `idNivel` to the `respuesta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "respuesta" DROP COLUMN "respuestaUsuario",
ADD COLUMN     "idNivel" INTEGER NOT NULL;
