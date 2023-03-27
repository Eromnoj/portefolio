import React, { FC } from 'react'
import styles from '@/styles/CurriculumEntry.module.scss'
import type { CurriculumEntryProps } from '@/lib/types/props'



const CurriculumEntry:FC<CurriculumEntryProps> = ({id, startDate, endDate, occupation, society}) => {


  return (
    <div className={[styles.contentFormat].join(' ')}>
      <div className={[styles.contentTitle].join(' ')}>
        <h3 className={[styles.medFont].join(' ')}>{`${new Date(startDate).getDate()}/${new Date(startDate).getMonth() + 1 >= 10 ? new Date(startDate).getMonth() + 1 : '0'+(new Date(startDate).getMonth() + 1)}/${new Date(startDate).getFullYear()}`} - {`${new Date(endDate).getDate()}/${new Date(endDate).getMonth() + 1 >= 10 ? new Date(endDate).getMonth() + 1 : '0'+(new Date(endDate).getMonth() + 1)}/${new Date(endDate).getFullYear()}`}</h3>
      </div>
      <div className={[styles.contentText].join(' ')}>
        <p className={[styles.contentFont].join(' ')}>
          {occupation}
        </p>
        <p className={[styles.contentFont, styles.italic].join(' ')}>{society}</p>
      </div>
    </div>
  )
}

export default CurriculumEntry