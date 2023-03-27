import React, { useReducer, useState } from 'react'
import styles from '@/styles/ContactForm.module.scss'
import type { FC } from 'react'
import type { ContactFormProps } from '@/lib/types/props'
import axios from 'axios'
import LoadingSVG from './LoadingSVG'
import Link from 'next/link'

type mail = {
  email: string,
  subject: string,
  message: string
}

enum ActionType {
  EMAIL = 'EMAIL',
  SUBJECT = 'SUBJECT',
  MESSAGE = 'MESSAGE'
}

type action = {
  type: ActionType,
  value: string
}
const ContactForm: FC<ContactFormProps> = ({ hideContact }) => {
  const mailState: mail = {
    email: '',
    subject: '',
    message: ''
  }
  const mailReducer = (state: mail, action: action) => {
    switch (action.type) {
      case ActionType.EMAIL:
        return { ...state, email: action.value }
      case ActionType.SUBJECT:
        return { ...state, subject: action.value }
      case ActionType.MESSAGE:
        return { ...state, message: action.value }
    }
  }
  const [mail, dispatch] = useReducer(mailReducer, mailState)
  const submitEmail = async () => {
    try {
      const res = await axios.post('/api/mail', mail)

      const data = await res.data

      setResponse(data.message)
      setMessageSent(true)
      setLoading(false)
    } catch (error:any) {
      setResponse(error?.response.data.message)
      setMessageSent(true)
      setLoading(false)
    }

  }
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  return (
    <div className={[styles.contactWindow].join(' ')}>
      <div className={[styles.contactContainer].join(' ')}>
       {
       
       loading ? <><LoadingSVG /> <Link href={'https://loading.io'}>loading.io</Link></>: messageSent ? <p className={styles.medFont}>{response}</p>:
       <form className={[styles.contactForm].join(' ')} onSubmit={(e) => {
          e.preventDefault()
          setLoading(true)
          submitEmail()
        }}>
          <div className={[styles.formInput].join(' ')}>
            <label htmlFor="email" className={[styles.medFont].join(' ')}>Votre Email :</label>
            <input type="email" name="email" id="email" value={mail.email} onChange={(e)=> dispatch({type: ActionType.EMAIL, value: e.target.value})} />
          </div>
          <div className={[styles.formInput].join(' ')}>
            <label htmlFor="subject" className={[styles.medFont].join(' ')}>Sujet :</label>
            <input type="text" name="subject" id="subject" value={mail.subject} onChange={(e) => dispatch({type: ActionType.SUBJECT, value: e.target.value})} />
          </div>
          <div className={[styles.formInput].join(' ')}>
            <label htmlFor="message" className={[styles.medFont].join(' ')}>Votre message :</label>
            <textarea name="message" id="message" cols={30} rows={10} value={mail.message} onChange={(e) => dispatch({type: ActionType.MESSAGE, value: e.target.value})}></textarea>
          </div>
          <input type="submit" value="Envoyer" />
        </form>}
      </div>
      <div className={[styles.closeWindow].join(' ')} onClick={hideContact}></div>
    </div>
  )
}

export default ContactForm