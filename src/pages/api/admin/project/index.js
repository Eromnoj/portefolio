// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import client from '@/lib/utils/prismadb';

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export const config = {
  api: {
    bodyParser: false
  }
}

const prisma = client;

export default async function handler(
  req,
  res
) {

  
  return new Promise(async (resolve) => {
    
    if (req.method === 'GET') {
      try {
        const project = await prisma.project.findMany({
          
          include: { categories: true },
          
        })
        
        await prisma.$disconnect()
        res.status(200).json({ data: project })
        return resolve()
        
      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      }
      
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return resolve()
      }
      // check if folder exists, if not create it
      try {
        await fs.readdir(path.join(process.cwd() + "/public", "/uploads"))
      } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"))
      }
      // configure formidable options
      const options = {}
      options.uploadDir = path.join(process.cwd(), "/public/uploads")
      options.filename = (name, ext, path) => {
        return Date.now().toString() + "_" + path.originalFilename
      }
      options.filter = ({ mimetype }) => {
        return (mimetype && mimetype.includes("image")) || false
      }
      const form = formidable(options)


      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'Une erreur est survenue' })
          return resolve()
        }

        // res.json({fields,files})

        const projectExists = await prisma.project.findFirst({
          where: {
            name: fields.name[0]
          }
        })

        const categories = fields.categories[0].split('//').map(cat => {
          return {
            id: cat
          }
        })
        console.log(categories);

        if (projectExists === null) {
          try {
            const project = await prisma.project.create({
              data: {
                name: fields.name[0],
                url: fields.url[0],
                description: fields.description[0],
                image: files.image[0].newFilename,
                categories: { connect: categories }
              }
            })

            await prisma.$disconnect()
            res.status(200).json({ data: project })
            return resolve()

          } catch (e) {
            console.error(e)
            await prisma.$disconnect()
            res.status(500).json({ e })
            return resolve()
          }
        } else {
          await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
          res.status(500).json({ message: 'Categorie existe déjà' })
          await prisma.$disconnect()
          return resolve()
        }
      })

    }
  })
}


