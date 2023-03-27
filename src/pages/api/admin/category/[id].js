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
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return resolve()
    }
    if (req.method === 'GET') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const category = await prisma.category.findUnique({
            where: {
              id: id
            }
          })

          await prisma.$disconnect()
          res.status(200).json({ data: category })
          return resolve()

        } catch (e) {
          console.error(e)
          await prisma.$disconnect()
          res.status(500).json({message: 'Pas de catégories enregistrées'})
          return resolve()
        }
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query
      if (typeof (id) === 'string') {
        try {
          const category = await prisma.category.delete({
            where: {
              id: id
            }
          })
          const imageName = category.image

          await prisma.$disconnect()
          try {
            await fs.rm(path.join(process.cwd() + "/public", "/uploads", imageName))
          } catch (error) {
            res.status(200).json({ data: category })
            return resolve()
          }
          res.status(200).json({ data: category })
          return resolve()

        } catch (e) {
          await prisma.$disconnect()
          res.status(200).json({ message: 'La catégorie n\'existe pas' })
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
              return resolve()
            }

            try {
              const currentCategory = await prisma.category.findUnique({
                where: {
                  id: id
                }
              })

              let currentImage = ''
              let currentAlt = ''
              await prisma.$disconnect()
              if (currentCategory !== null && (files.image !== undefined && files.image.length > 0)) {
                currentAlt = currentCategory.alt
                try {
                  await fs.rm(path.join(process.cwd() + "/public", "/uploads", currentCategory.image))
                } catch (error) {
                  res.status(500).json({ message: 'Une erreur est survenue 13' })
                  return resolve()
                }
              } else if (currentCategory !== null) {
                currentAlt = currentCategory.alt
                currentImage = currentCategory.image
              }

              try {
                console.log(fields.alt[0]);
                
                const category = await prisma.category.update({
                  where: {
                    id: id
                  },
                  data: {
                    alt: fields.alt[0],
                    image: files.image !== undefined ? files.image[0].newFilename : currentImage
                  }
                })

                await prisma.$disconnect()
                res.status(200).json({ data: category })
                return resolve()

              } catch (e) {
                console.error(e)
                await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
                await prisma.$disconnect()
                res.status(500).json({ message: 'Aucune catégorie ne correspond a cet id' })

              }

            } catch (error) {
            await prisma.$disconnect()
            res.status(500).json({ message: 'Aucune catégorie ne correspond a cet id' })
              return resolve()
            }

          })
        } catch (e) {
          await prisma.$disconnect()
          res.status(200).json({ message: 'La catégorie n\'existe pas' })
          return resolve()
        }
      }
    }
  })

}


