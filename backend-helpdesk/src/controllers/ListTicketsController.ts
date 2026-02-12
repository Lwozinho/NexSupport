import { Request, Response } from 'express';
import { ListTicketsService } from '../services/ListTicketsService';

class ListTicketsController {
  async handle(req: Request, res: Response) {
    // Pegamos o ID do usuário logado (que o middleware de autenticação colocou no req)
    const user_id = (req as any).user_id; 

    const listTicketsService = new ListTicketsService();

    const tickets = await listTicketsService.execute(user_id);

    return res.json(tickets);
  }
}

export { ListTicketsController }