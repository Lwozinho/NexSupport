import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DashboardMetricService {
  async execute() {
    
    // 1. Contar totais por Status
    // O Prisma faz isso muito rápido com o 'groupBy'
    const statusCount = await prisma.ticket.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // 2. Contar total geral
    const totalTickets = await prisma.ticket.count();

    // 3. Organizar para o Frontend
    // O Prisma devolve um array meio "cru", vamos formatar:
    const formattedData = {
      total: totalTickets,
      status: {
        ABERTO: 0,
        ANDAMENTO: 0,
        ENCERRADO: 0
      }
    };

    statusCount.forEach((item) => {
      if (item.status === 'ABERTO') formattedData.status.ABERTO = item._count.status;
      if (item.status === 'EM ANDAMENTO') formattedData.status.ANDAMENTO = item._count.status;
      if (item.status === 'ENCERRADO') formattedData.status.ENCERRADO = item._count.status;
    });

    return formattedData;
  }
}

export { DashboardMetricService }