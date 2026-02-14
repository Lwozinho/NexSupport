import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Vamos criar a senha criptografada (igual o sistema faz)
  const passwordHash = await hash('olafibra7812', 8)

  // Criar o usuário
  await prisma.user.create({
    data: {
      name: "Admin Raphael B.",
      email: "frank@tec.com",
      password: passwordHash,
      role: "TECH" // Importante ser TECH para ver tudo
    }
  })
}

main()
  .then(() => {
    console.log("✅ Usuário Admin criado com sucesso!")
    prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })