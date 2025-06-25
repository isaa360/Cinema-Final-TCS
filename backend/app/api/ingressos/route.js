// backend/app/api/ingressos/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ingressos = await prisma.ticket.findMany({
      include: {
        session: {
          include: {
            movie: {
              select: {
                title: true,
                genre: true,
                rating: true,
              },
            },
            room: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc', // Ou outro critério de ordenação
      },
    });

    const ingressosFormatados = ingressos.map(ingresso => ({
      ...ingresso,
      session: {
        ...ingresso.session,
        dateTime: ingresso.session.dateTime.toISOString(), // Garante formato de string
      }
    }));

    return NextResponse.json(ingressosFormatados, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar ingressos:", error);
    return NextResponse.json({ error: "Falha ao buscar ingressos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, clientName, clientCpf, seat, paymentType } = body;

    if (!sessionId || !clientName || !clientCpf || !seat || !paymentType) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const novoIngresso = await prisma.ticket.create({
      data: {
        sessionId,
        clientName,
        clientCpf,
        seat,
        paymentType,
      },
    });

    // Opcional: Aqui você pode adicionar lógica para decrementar a capacidade da sessão
    // ou verificar disponibilidade de assentos. Por enquanto, faremos apenas o registro.

    return NextResponse.json(novoIngresso, { status: 201 });
  } catch (error) {
    console.error("Erro ao vender ingresso:", error);
    return NextResponse.json({ error: "Falha ao vender ingresso" }, { status: 500 });
  }
}