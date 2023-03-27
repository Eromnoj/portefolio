import React, { useState } from 'react'
import styles from '@/styles/CategoryBox.module.scss';
import type { FC } from 'react'
import Image from 'next/image';
import { myLoader } from '@/lib/utils/function'
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
        loader={myLoader}
        src={image}
        alt={alt}
        width={55}
        height={55}
        quality={100}
        />
      </div>
    </div>
  )
}

export default CategoryBox