/*
  Warnings:

  - Added the required column `idCategoria` to the `nivel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nivel" ADD COLUMN     "idCategoria" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "categoria" (
    "idCategoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- AddForeignKey
ALTER TABLE "ejercicio" ADD CONSTRAINT "ejercicio_idNivel_fkey" FOREIGN KEY ("idNivel") REFERENCES "nivel"("idNivel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nivel" ADD CONSTRAINT "nivel_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;
