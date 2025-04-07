/*
  Warnings:

  - Added the required column `respuestasCorrectas` to the `progreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRespuestas` to the `progreso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "progreso" ADD COLUMN     "nivelDesbloqueado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "respuestasCorrectas" INTEGER NOT NULL,
ADD COLUMN     "totalRespuestas" INTEGER NOT NULL;
