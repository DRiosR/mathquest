/*
  Warnings:

  - Added the required column `idCategoria` to the `ejercicio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ejercicio" ADD COLUMN     "idCategoria" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ejercicio" ADD CONSTRAINT "ejercicio_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;
