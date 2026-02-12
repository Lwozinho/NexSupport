import { Request, Response } from 'express';
import { CreateTicketService } from '../services/CreateTicketService';

class CreateTicketController {
  async handle(req: Request, res: Response) {
    const { title, description, user_id } = req.body;
    const createTicketService = new CreateTicketService();

    let filename = null;
    if(req.file){
        filename = req.file.filename;
    }

    const ticket = await createTicketService.execute({
      title,
      description,
      user_id,
      attachment: filename
    });

    

    return res.json(ticket);
  }
}



export { CreateTicketController }