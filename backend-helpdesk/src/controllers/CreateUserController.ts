import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';

class CreateUserController {
  async handle(req: Request, res: Response) {
    // Pega os dados do corpo da requisição
    const { name, email, password, role } = req.body;

    const createUserService = new CreateUserService();

    try {
      // Chama o serviço
      const user = await createUserService.execute({
        name,
        email,
        password,
        role
      });

      return res.json(user);
    } catch (err) {
      // Se der erro (ex: email duplicado), devolve erro 400
      return res.status(400).json({ error: "Erro ao criar usuário" });
    }
  }
}

export { CreateUserController }