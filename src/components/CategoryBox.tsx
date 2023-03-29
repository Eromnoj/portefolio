import React, { useState } from 'react'
import styles from '@/styles/CategoryBox.module.scss';
import type { FC } from 'react'
import Image from 'next/image';
import type { CategoryBoxFilterProps } from '@/lib/types/props';


const CategoryBox: FC<CategoryBoxFilterProps> = ({id, image, alt, onClick}) => {

  const [selected, setSelected] = useState(false)

  return (
    <div className={selected ? [styles.categoryBox, styles.selected].join(' '): styles.categoryBox} onClick={(e) => {
      onClick(e)
      setSelected(prev => !prev)
      }}>
      <div className={styles.categoryImg}>
        <Image 
        src={image}
        alt={alt}
        width={55}
        height={55}
        quality={100}
        style={{
          borderRadius: '10px'
        }}
        />
      </div>
    </div>
  )
}

export default CategoryBox