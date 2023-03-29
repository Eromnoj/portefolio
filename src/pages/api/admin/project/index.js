// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import client from '@/lib/utils/prismadb';

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import cloudStorage from '../../../../lib/utils/cloudinary'
import { uid } from 'uid'

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
        await prisma.$disconnect()
        res.status(404).json({ message : "Aucun projets trouvés" })
        return resolve()
      }
      
    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return resolve()
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

        if (projectExists === null) {
          try {
            const cloudinaryImgId = uid()
            const resCloudinary = files.image !== undefined && await cloudStorage.uploader.upload(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename), { public_id: cloudinaryImgId })
            const project = await prisma.project.create({
              data: {
                name: fields.name[0],
                url: fields.url[0],
                description: fields.description[0],
                image: resCloudinary.secure_url,
                categories: { connect: categories },
                cloudinaryImgId: cloudinaryImgId
              }
            })

            await prisma.$disconnect()
            files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
            res.status(201).json({ data: project })
            return resolve()

          } catch (e) {
            files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
            await prisma.$disconnect()
            res.status(500).json({ message : "Erreur lors de la création du projet" })
            return resolve()
          }
        } else {
          files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
          res.status(400).json({ message: 'Categorie existe déjà' })
          await prisma.$disconnect()
          return resolve()
        }
      })

    }
  })
}


