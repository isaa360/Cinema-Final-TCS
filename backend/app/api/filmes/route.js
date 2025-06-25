// backend/app/api/filmes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const filmes = await prisma.movie.findMany(); // Usamos 'movie' porque assim definimos no schema.prisma
    return NextResponse.json(filmes, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return NextResponse.json({ error: "Falha ao buscar filmes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, genre, rating, duration, releaseDate } = body;

    if (!title || !genre || !rating || !duration || !releaseDate) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novoFilme = await prisma.movie.create({ // Usamos 'movie' porque assim definimos no schema.prisma
      data: {
        title,
        description,
        genre,
        rating,
        duration: parseInt(duration, 10),
        releaseDate: new Date(releaseDate),
      },
    });

    return NextResponse.json(novoFilme, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar filme:", error);
    if (error.code === 'P2002') { // Violação de restrição única (ex: título de filme já existe)
      return NextResponse.json({ error: "Filme com este título já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: "Falha ao criar filme" }, { status: 500 });
  }
}