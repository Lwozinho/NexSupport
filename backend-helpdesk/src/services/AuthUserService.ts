import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    
    // 1. Verificar se o e-mail existe
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new Error("Email incorreto!");
    }

    // 2. Verificar se a senha bate (Comparar a senha digitada com a criptografada)
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Senha incorreta!");
    }

    // 3. Gerar o Token JWT
    // O primeiro parametro é o "payload" (dados que vão dentro do token)
    // O segundo é uma chave secreta (no futuro colocaremos no .env)
    // O terceiro é a configuração (expira em 30 dias)
    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role // Importante para o Front saber se é Tech ou Client
      },
      process.env.JWT_SECRET || "segredo-do-jwt-helpdesk", // Chave secreta provisória
      {
        subject: user.id,
        expiresIn: '30d'
      }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    }
  }
}

export { AuthUserService }