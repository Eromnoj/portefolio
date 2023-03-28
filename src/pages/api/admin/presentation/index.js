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
        const presentation = await prisma.presentation.findMany({

        })

        await prisma.$disconnect()
        res.status(200).json({ data: presentation })
        return resolve()

      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        res.status(404).json({ message: "Pas de présentation enregistrée" })
      }

    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return resolve()
      }
      const { presentation } = req.body
      try {
        const isPresentation = await prisma.presentation.findMany({

        })

        let curriculum
        if (isPresentation.length > 0) {
          curriculum = await prisma.presentation.update({
            where: {
              id : isPresentation[0].id
            },
            data : {
              presentation: presentation
            }
          })
        } else {
          curriculum = await prisma.presentation.create({
            data : {
              presentation: presentation
            }
          })
        }
        
        await prisma.$disconnect()
        res.status(200).json({ data: curriculum })
        return resolve()

      } catch (e) {
        await prisma.$disconnect()
        res.status(500).json({ message : "Erreur lors de l'enregistrement de la présentation"})
        return resolve()
      }

    }

  })

}


