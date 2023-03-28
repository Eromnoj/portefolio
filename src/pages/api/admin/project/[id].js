// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import client from '@/lib/utils/prismadb';

import { authOptions } from '../../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import cloudStorage from '../../../../lib/utils/cloudinary'
import { uid } from 'uid';

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

    const session = await getServerSession(req, res, authOptions)

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return resolve()
      }
      
    if (req.method === 'GET') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const project = await prisma.project.findUnique({
            where: {
              id: id
            },
            include: {categories: true}
          })

          await prisma.$disconnect()
          res.status(200).json({ data: project })
          return resolve()

        } catch (e) {
          await prisma.$disconnect()
          res.status(404).json({message: 'Pas de projet enregistré avec cet ID'})
          return resolve()
        }
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const project = await prisma.project.delete({
            where: {
              id: id
            }
          })

          await prisma.$disconnect()
          try {
            await cloudStorage.api.delete_resources([project.cloudinaryImgId])
          } catch (error) {
            res.status(500).json({ message : "Erreur lors de la suppression de l'image du cloud" })
            return resolve()
          }
          res.status(200).json({ data: project })
          return resolve()

        } catch (e) {
          await prisma.$disconnect()
          res.status(200).json({ message: 'Le projet n\'existe pas' })
          return resolve()
        }
      }

    } else if (req.method === 'POST') {

      const { id } = req.query

      if (typeof (id) === 'string') {
        try {
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
              res.status(500).json({ error: 'Une erreur est survenue 12' })
            }

            try {
              const currentProject = await prisma.project.findUnique({
                where: {
                  id: id
                },
                include:{categories: true}
              })

              
              // const currentCategories = currentProject.categories.map(cat => {
              //   return {
              //     id: cat.id
              //   }
              // })

              await prisma.$disconnect()
              if (currentProject !== null && (files.image !== undefined && files.image.length > 0)) {
                try {
                  await cloudStorage.api.delete_resources([currentProject.cloudinaryImgId])
                } catch (error) {
                  res.status(500).json({ message: 'Une erreur est survenue 13' })
                  return resolve()
                }
              } 

              try {
                const categories = fields.categories[0].split('//').map(cat => {
                  return {
                    id: cat
                  }
                }) 
                
                const cloudinaryImgId = uid()
                const resCloudinary = await cloudStorage.uploader.upload(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename), { public_id: cloudinaryImgId })

                const project = await prisma.project.update({
                  where: {
                    id: id
                  },
                  data: {
                    name: fields.name !== undefined ? fields.name[0] : currentProject.image,
                    description: fields.description !== undefined ? fields.description[0]: currentProject.description,
                    url: fields.url !== undefined ? fields.url[0] : currentProject.url,
                    categories : {set: categories},
                    image: files.image !== undefined ? resCloudinary.secure_url : currentProject.image,
                    cloudinaryImgId: files.image !== undefined ? cloudinaryImgId : currentProject.cloudinaryImgId
                  }
                })

                await prisma.$disconnect()
                await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
                res.status(200).json({ data: project })
                return resolve()

              } catch (e) {
                console.error(e)
                await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
                await prisma.$disconnect()
                res.status(404).json({ message: 'Aucun projet ne correspond a cet id' })

              }

            } catch (error) {
            await prisma.$disconnect()
            res.status(500).json({ message: 'Aucun projet ne correspond a cet id' })
              return resolve()
            }

          })
        } catch (e) {
          await prisma.$disconnect()
          res.status(404).json({ message: 'Le projet n\'existe pas' })
          return resolve()
        }
      }
    }
  })

}


