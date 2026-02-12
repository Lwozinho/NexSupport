import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

interface UserRequest {
  name: string;
  email: string;
  password: string;
  role?: string; // Opcional, se não mandar vira CLIENT
}

class CreateUserService {
  async execute({ name, email, password, role }: UserRequest) {
    
    // 1. Verificar se o usuário já existe
    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    // 2. Criptografar a senha (Hash)
    const passwordHash = await hash(password, 8);

    // 3. Criar o usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: role || "CLIENT", // Se não vier role, assume CLIENT
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Não devolvemos a senha por segurança
      }
    })

    return user;
  }
}

export { CreateUserService }