import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TicketRequest {
  title: string;
  description: string;
  user_id: string;
  attachment?: string | null; 
}

class CreateTicketService {
  async execute({ title, description, user_id, attachment }: TicketRequest) {

    if(!title || !description) {
      throw new Error("Title and Description are required")
    }
    
    const ticket = await prisma.ticket.create({
      data: {
        title: title,
        description: description,
        customer_id: user_id, // Conecta o chamado ao usuário
        status: "ABERTO",
        attachment: attachment
      }
    })

    return ticket;
  }
}

export { CreateTicketService }