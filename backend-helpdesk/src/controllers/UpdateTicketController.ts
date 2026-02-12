import { Request, Response } from 'express';
import { UpdateTicketService } from '../services/UpdateTicketService';

class UpdateTicketController {
  async handle(req: Request, res: Response) {
    // Agora esperamos receber também o technician_id do frontend
    const { ticket_id, status, technician_id } = req.body;

    const updateTicketService = new UpdateTicketService();

    const ticket = await updateTicketService.execute({
      ticket_id,
      status,
      technician_id
    });

    return res.json(ticket);
  }
}

export { UpdateTicketController }