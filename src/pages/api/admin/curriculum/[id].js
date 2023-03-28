import client from '@/lib/utils/prismadb';

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
const prisma = client;


export default async function handler(
  req,
  res
) {
  return new Promise(async (resolve) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return resolve()
    }
    if (req.method === 'GET') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const curriculum = await prisma.curriculum.findUnique({
            where: {
              id: id
            }
          })

          await prisma.$disconnect()
          res.status(200).json({ data: curriculum })
          return resolve()

        } catch (e) {
          console.error(e)
          await prisma.$disconnect()
          res.status(404).json({message: 'Pas de curriculae enregistrées'})
          return resolve()
        }
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const curriculum = await prisma.curriculum.delete({
            where: {
              id: id
            }
          })

          await prisma.$disconnect()

          res.status(200).json({ data: curriculum })
          return resolve()

        } catch (e) {
          await prisma.$disconnect()
          res.status(404).json({ message: 'La ligne de cv n\'existe pas' })
          return resolve()
        }
      }

    } else if (req.method === 'PATCH') {

      const { id } = req.query

      if (typeof (id) === 'string') {
        const {startDate, endDate, occupation, society} = req.body
        try {
          const curriculum = await prisma.curriculum.update({
            where: {
              id: id
            },
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
          res.status(500).json({ message: "La catégorie n'existe pas" })
          return resolve()
        }
      
      
      }
    }
  })

}


