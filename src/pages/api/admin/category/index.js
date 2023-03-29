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
        const category = await prisma.category.findMany()

        await prisma.$disconnect()
        res.status(200).json({ data: category })
        return resolve()

      } catch (e) {
        await prisma.$disconnect()
        res.status(404).json({ error: 'Aucune catégories trouvées' })
        resolve()
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
          resolve()
        }

        const categoryExists = await prisma.category.findFirst({
          where: {
            alt: fields.alt[0]
          }
        })

        if (categoryExists === null) {

          try {
            const cloudinaryImgId = uid()
            const resCloudinary = files.image !== undefined && await cloudStorage.uploader.upload(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename), { public_id: cloudinaryImgId })
            const category = await prisma.category.create({
              data: {
                alt: fields.alt[0],
                image: resCloudinary.secure_url,
                cloudinaryImgId: cloudinaryImgId
              }
            })

            await prisma.$disconnect()
            files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
            res.status(201).json({ data: category })
            return resolve()

          } catch (e) {
            files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
            await prisma.$disconnect()
            res.status(500).json({ message: 'Erreur lors de la création de la catégorie' })
            return resolve()
          }
        } else {
          files.image !== undefined && await fs.rm(path.join(process.cwd() + "/public", "/uploads", files.image[0].newFilename))
          await prisma.$disconnect()
          res.status(400).json({ message: 'Categorie existe déjà' })
          return resolve()
        }
      })

    }
  })
}


