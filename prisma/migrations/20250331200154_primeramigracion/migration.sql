-- CreateTable
CREATE TABLE "usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "ejercicio" (
    "idEjercicio" SERIAL NOT NULL,
    "idNivel" INTEGER NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuestaCorrecta" TEXT NOT NULL,
    "opciones" TEXT NOT NULL,

    CONSTRAINT "ejercicio_pkey" PRIMARY KEY ("idEjercicio")
);

-- CreateTable
CREATE TABLE "logro_recompensa" (
    "idRecompensa" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL,

    CONSTRAINT "logro_recompensa_pkey" PRIMARY KEY ("idRecompensa")
);

-- CreateTable
CREATE TABLE "nivel" (
    "idNivel" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,

    CONSTRAINT "nivel_pkey" PRIMARY KEY ("idNivel")
);

-- CreateTable
CREATE TABLE "progreso" (
    "idProgreso" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idNivel" INTEGER NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "progreso_pkey" PRIMARY KEY ("idProgreso")
);

-- CreateTable
CREATE TABLE "respuesta" (
    "idRespuesta" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idEjercicio" INTEGER NOT NULL,
    "respuestaUsuario" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL,

    CONSTRAINT "respuesta_pkey" PRIMARY KEY ("idRespuesta")
);

-- CreateTable
CREATE TABLE "usuario_logro" (
    "idLogro" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idRecompensa" INTEGER NOT NULL,
    "fechaObtenido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_logro_pkey" PRIMARY KEY ("idLogro")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");
