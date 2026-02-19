import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

class EditUserController {
  async handle(req: Request, res: Response) {
    const { id, name, password } = req.body;

    const updateData: any = { name };

    // Se uma nova senha foi enviada, criptografa e adiciona aos dados de atualização
    if (password && password.trim() !== '') {
      updateData.password = await hash(password, 8);
    }

    const userUpdated = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return res.json(userUpdated);
  }
}

export { EditUserController };