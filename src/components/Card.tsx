import React, { FC } from 'react'
import styles from '@/styles/Card.module.scss'
import Image from 'next/image'
import CategoryBox from './CategoryBox'
import { myLoader } from '@/lib/utils/function'
import type { CardProps } from '@/lib/types/props'
import Link from 'next/link'

const Cards:FC<CardProps> = ({name, image, url, description, categories}) => {
  return (
    <div className={[styles.card].join(' ')}>
      <div className={[styles.cardHeader].join(' ')}>
        <h3 className={[styles.cardTitle, styles.cardTitleFont].join(' ')}>
          {name}
        </h3>
      </div>
      <div className={[styles.cardBody].join(' ')}>
        <div className={[styles.cardImage].join(' ')}>
          <Link href={url} target='_blank' >
        <Image 
        loader={myLoader}
        src={image}
        alt={name}
        width={300}
        height={150}
        quality={100}
        style={{
          objectFit: 'cover'
        }}
        />
        </Link>

        </div>
        <div className={[styles.cardDescription, styles.contentFont].join(' ')}>{description}</div>

      </div>
      <div className={styles.cardCategories}>
        {
          categories.map((category,i) => {
            return (
              <CategoryBox key={i} id={category.id} image={category.image} alt={category.alt} onClick={() => {}}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default Cards