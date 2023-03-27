import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '../../../lib/utils/prismadb'

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
    // ...add more providers here
  ],
  callbacks : {
    async signIn({user}) {
      if (user.email !== null){
        const isFirstUser = await prisma.user.findMany({})

        if(isFirstUser.length > 0) {

          const dbUser = await prisma.user.findUnique({
            where : {
              email: user.email
            }
          })
          
          if(dbUser !== null && dbUser.role === 'ADMIN') {
            prisma.$disconnect()
            return true
          } else {
            prisma.$disconnect()
            return false
          }
        } else {
          await prisma.user.create({
            data: {
              email: user.email,
              role: 'ADMIN'
            }
          })
            prisma.$disconnect()
            return true
        }
          
      } else {
            prisma.$disconnect()
            return false
      }
    }
  }
}
export default NextAuth(authOptions)