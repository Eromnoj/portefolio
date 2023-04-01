// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import client from '@/lib/utils/prismadb';
const prisma = client

export default async function handler(
  req,
  res
) {
  return new Promise(async (resolve) => {

    if (req.method === 'GET') {

      const {filter} = req.query
      try {
      let project
      if(filter && filter.length > 0) {
        project = await prisma.project.findMany({
          where: {
            categories: {
             some: {
                id: { in: filter.split(',') }
              }
            }
          },
          include: { categories: true },

        })
      } else {
        project = await prisma.project.findMany({
          include: { categories: true },
        })
      }
        await prisma.$disconnect()
        res.status(200).json({ data: project })
        return resolve()

      } catch (e) {
        await prisma.$disconnect()
        res.status(500).json({message : "Une erreur est survenue"})
        return resolve()
      }

    } 
  })
}


