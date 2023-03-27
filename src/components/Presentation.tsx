import React, { useEffect, useState } from 'react'
import styles from '@/styles/CurriculumEntry.module.scss'
import axios from 'axios'

const Presentation = () => {

const [pres, setPres] = useState('')

const getPres = async () => {
  try {
    const res = await axios.get('/api/admin/presentation')

    const data = res.data

    setPres(data.data[0].presentation)
  } catch (error) {
    
  }

}

useEffect(()=> {
  let ignore = false
  if (!ignore) {
    getPres()
  }
  return () => {
    ignore = true
  }
},[])
  return (
    <div className={[styles.contentFormat].join(' ')}>
      <div className={[styles.contentTitle].join(' ')}>
        <h3 className={[styles.medFont].join(' ')}>J&apos;me présente...</h3>
      </div>
      <div className={[styles.contentText].join(' ')}>
        <p className={[styles.contentFont].join(' ')}>
         {pres} </p>
      </div>
    </div>
  )
}

export default Presentation