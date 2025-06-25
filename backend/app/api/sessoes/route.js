// backend/app/api/sessoes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Inclui os dados de Movie e Room para que o frontend possa exibir detalhes
    const sessoes = await prisma.session.findMany({
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            duration: true,
            genre: true,
            rating: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            type: true
          }
        },
      },
      orderBy: {
        dateTime: 'asc', // Ordena as sessões por data e hora
      },
    });

    // Formata a data/hora para um formato mais legível se necessário no frontend
    const sessoesFormatadas = sessoes.map(sessao => ({
      ...sessao,
      dateTime: sessao.dateTime.toISOString(), // Converte para string ISO para consistência
    }));

    return NextResponse.json(sessoesFormatadas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    return NextResponse.json({ error: "Falha ao buscar sessões" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { movieId, roomId, dateTime, price, language, format } = body;

    if (!movieId || !roomId || !dateTime || !price || !language || !format) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novaSessao = await prisma.session.create({
      data: {
        movieId,
        roomId,
        dateTime: new Date(dateTime), // Converte a string de data/hora para um objeto Date
        price: parseFloat(price),
        language,
        format,
      },
    });

    return NextResponse.json(novaSessao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    return NextResponse.json({ error: "Falha ao criar sessão" }, { status: 500 });
  }
}