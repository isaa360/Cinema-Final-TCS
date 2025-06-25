// backend/app/api/salas/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const salas = await prisma.room.findMany(); // 'room' é como definimos no schema.prisma
    return NextResponse.json(salas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return NextResponse.json({ error: "Falha ao buscar salas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, capacity, type } = body;

    if (!name || !capacity || !type) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novaSala = await prisma.room.create({ // 'room' é como definimos no schema.prisma
      data: {
        name,
        capacity: parseInt(capacity, 10),
        type,
      },
    });

    return NextResponse.json(novaSala, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    if (error.code === 'P2002') { // Violação de restrição única (ex: nome da sala já existe)
      return NextResponse.json({ error: "Sala com este nome já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Falha ao criar sala" }, { status: 500 });
  }
}