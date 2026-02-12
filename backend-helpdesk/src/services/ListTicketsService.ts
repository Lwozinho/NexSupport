import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ListTicketsService {
  async execute(user_id: string) {
    
    // 1. Verificar quem está solicitando
    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Definir a regra de visualização
    let whereCondition = {};

    if (user.role === 'CLIENT') {
      // SE FOR CLIENTE: Só vê os próprios chamados. Ponto final.
      whereCondition = {
        customer_id: user.id
      }
    }
    // SE FOR TÉCNICO (user.role === 'TECH'): 
    // O whereCondition continua vazio {}, ou seja, busca todos.

    // 3. Buscar no banco com a regra aplicada
    const tickets = await prisma.ticket.findMany({
      where: whereCondition,
      include: {
        customer: true,
        technician: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return tickets;
  }
}

export { ListTicketsService }