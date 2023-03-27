// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import nodemailer from 'nodemailer'
import { resolve } from 'path';


export default async function handler(
  req,
  res
) {

  if (req.method === 'POST'){

    const {email, subject, message} = req.body

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    });
    
    // send mail with defined transport object
    try {
      let info = await transporter.sendMail({
        from: `"Contact Portefolio" <j.moreschi@outlook.fr>`, // sender address
        to: "contact@jomoreschi.fr", // list of receivers
        subject: `"${subject}" venant de : ${email}`, // Subject line
        // text: `${message}`, // plain text body
        html: `
        <h3><b>Nouveau message entrant de :</b> <a href:"mailto:${email}">${email}</h3>
        <h4>Sujet : ${subject}</h4>
        <p>${message}</p>
        `, // html body
      });
      
      // console.log("Message sent: %s", info.messageId);
      // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
      // // Preview only available when sending through an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      
      res.status(201).json({message : "Votre email a bien été envoyé"})
      resolve()
    } catch (error) {
      res.status(500).json({message : "Une erreur est survenue lors de l'envoi. Veuillez réessayer"})
      resolve()
    }
      
  }
} 
