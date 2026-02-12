import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService'; // Reutilizamos o serviço existente

class CreateClientController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    // AQUI ESTÁ A SEGURANÇA:
    // Nós passamos manualmente o role: "CLIENT".
    // Mesmo que tentem burlar, o sistema vai criar como cliente.
    const user = await createUserService.execute({
      name,
      email,
      password,
      role: "CLIENT" // <--- Forçado
    });

    return res.json(user);
  }
}

export { CreateClientController }