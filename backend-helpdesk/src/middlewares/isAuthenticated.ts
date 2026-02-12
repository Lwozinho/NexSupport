import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
){
    console.log("middleware iniciado")

  // 1. Receber o token
  const authToken = req.headers.authorization;

  if(!authToken){
    console.log("Sem token")
    return res.status(401).end();
  }

  // 2. Pegar apenas o token (o Bearer vem junto)
  const [, token] = authToken.split(" ");

  try{
    // 3. Validar o token
    const { sub } = verify(
      token,
      process.env.JWT_SECRET as string
    ) as Payload;

    // 4. Injetar o ID do usuário na requisição
    // O erro "user_id does not exist" acontece AQUI se não tivermos o arquivo @types
    console.log("Token válido. IdUSER:", sub);
    (req as any).user_id = sub;

    return next();

  }catch(err){
    console.log("token inválido", err)
    return res.status(401).end();
  }
}