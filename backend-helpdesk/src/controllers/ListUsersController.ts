import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ListUsersController {
  async handle(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Importante saber se é TECH ou CLIENT
        // JAMAIS selecionamos o password aqui
      }
    });

    return res.json(users);
  }
}

export { ListUsersController };