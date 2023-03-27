// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import client from '@/lib/utils/prismadb';

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

const prisma = client;

export default async function handler(
  req,
  res
) {
  return new Promise(async (resolve) => {

    if (req.method === 'GET') {
      try {
        const curriculum = await prisma.curriculum.findMany({

        })

        await prisma.$disconnect()
        res.status(200).json({ data: curriculum })
        return resolve()

      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        res.status(500).json({message: "Pas d'entrée curriculum"})
      }

    } else if (req.method === 'POST') { 
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return resolve()
      }
      const {startDate, endDate, occupation, society} = req.body
      try {
        const curriculum = await prisma.curriculum.create({
          data: {
            startDate : new Date(startDate),
            endDate: new Date(endDate),
            occupation: occupation,
            society: society
          }
        })

        await prisma.$disconnect()
        res.status(200).json({ data: curriculum })
        return resolve()

      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        res.status(500).json({ e })
        return resolve()
      }
        
 } 

})

}


