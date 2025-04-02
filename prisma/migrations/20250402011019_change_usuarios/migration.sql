/*
  Warnings:

  - You are about to drop the column `verificacion` on the `usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "usuario_usuario_key";

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "verificacion";
