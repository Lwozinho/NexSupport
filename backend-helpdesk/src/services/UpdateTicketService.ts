import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TicketRequest {
  ticket_id: number;
  status: string;
  technician_id?: string; // Novo campo opcional
}

class UpdateTicketService {
  async execute({ ticket_id, status, technician_id }: TicketRequest) {
    
    // Preparando os dados
    let dataToUpdate: any = {
      status: status
    };

    // Se estiver assumindo o chamado (Iniciando), salva quem é o técnico
    if (status === 'EM ANDAMENTO') {
      dataToUpdate.started_at = new Date();
      dataToUpdate.technician_id = technician_id; // Salva o ID do técnico
    }

    if (status === 'ENCERRADO') {
      dataToUpdate.ended_at = new Date();
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticket_id },
      data: dataToUpdate
    })

    return ticket;
  }
}

export { UpdateTicketService }