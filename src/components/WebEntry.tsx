import React, { FC } from 'react'
import styles from '@/styles/WebEntry.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import type { WebEntryType } from '@/lib/types/props'


const WebEntry:FC<WebEntryType> = ({id, logo, alt, url}) => {
  return (
    <div className={[styles.socialImg].join(' ')}>
      <Link href={url} target='_blank'>
      <Image 
        src={logo}
        alt={alt}
        width={150}
        height={150}
        quality={100}
        style={{
          
          borderRadius: '100%'
        }}
        />
        </Link>
    </div>
  )
}

export default WebEntry