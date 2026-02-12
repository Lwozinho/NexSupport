import express, { Request, Response, NextFunction } from 'express';

import cors from 'cors';

import { router } from './routes'; // Importamos as rotas
import path from 'path'
import { error } from 'console';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(router); // Usamos as rotas

// Middleware para tratamento de erros (Opcional mas boa prática)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  console.error("Erro no servidor:", err)

  if(err instanceof Error){
    return res.status(400).json({
      error: err.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  })
})

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});