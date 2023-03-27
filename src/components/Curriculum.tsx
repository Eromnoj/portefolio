import React, { useEffect, useState } from 'react'
import CurriculumEntry from './CurriculumEntry'
import styles from '@/styles/Curriculum.module.scss'
import { CurriculumEntryProps } from '@/lib/types/props'
import axios from 'axios'

const Curriculum = () => {

  const [curriculae, setCurriculae] = useState<Array<CurriculumEntryProps>>([])

  const getCurriculae = async () => {
    try {
      const res = await axios.get('/api/admin/curriculum')
      const data = res.data
      setCurriculae(data.data)
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCurriculae()
  }, [])


  const showCurriculae = curriculae.map(curriculum => {
    return (
      <CurriculumEntry 
        key={curriculum.id}
        id={curriculum.id}
        startDate={curriculum.startDate}
        endDate={curriculum.endDate}
        occupation={curriculum.occupation}
        society={curriculum.society}
      />
    )
  })
  return (
    <div className={[styles.curriculum].join(' ')}>

            <h2 className={[styles.titleFont].join(' ')}>Curriculum</h2>

            {
              showCurriculae
            }
          </div>
  )
}

export default Curriculum