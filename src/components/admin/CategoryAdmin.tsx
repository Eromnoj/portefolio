import { CategoryBoxProps } from '@/lib/types/props'
import axios from 'axios'
import React, { FormEvent, useEffect, useState } from 'react'
import CategoryRow from './CategoryRow'
import styles from '@/styles/AdminSection.module.scss'


const CategoryAdmin = () => {

  const [image, setImage] = useState<string | Blob>()
  const [alt, setAlt] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData()
    if (image !== undefined) {
      data.append('image', image)
      data.append('alt', alt)
      try {
        const res = await axios.post('/api/admin/category', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const resData = await res.data
        getCategories()

      } catch (error: any) {
        console.error(error?.response.data.message);

      }
    }
  }

  const [categories, setCategories] = useState<Array<CategoryBoxProps>>([])


   
  const getCategories = async () => {
    try {
      const res = await axios.get('/api/admin/category')
      const data = res.data      
      setCategories(data.data)
    } catch (error: any) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    getCategories()
  }, [])
  
  const showCat = categories.map(category => {
    return (
      <CategoryRow
        key={category.id}
        id={category.id}
        image={category.image}
        alt={category.alt}
        getCategories={getCategories}
      />
    )
  })
  return (
    <div className={styles.adminSection}>

    <h3 className={styles.medFont}>Ajouter une catégorie</h3>
    <form
      className={styles.adminForm}
      encType='multipart/form-data' onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }
      }>
      <div>
        <label htmlFor="image" className={styles.contentFont}>Image</label>
        <input type="file" name="image" id="image" onChange={(e) => {
          if (e.target.files !== null) {
            setImage(e.target.files[0])

          }
        }} />
      </div>
      <div>
        <label htmlFor="alt" className={styles.contentFont} >Alt</label>
        <input type="text" name="alt" id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
      </div>
      <div>
        <input type="submit" value="Envoyer" className={styles.contentFont} />
      </div>
    </form>

    <h3 className={styles.medFont}>Gérer les catégories</h3>
    <table className={styles.adminTable}>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Image</th>
          <th>Modifier</th>
          <th>supprimer</th>
        </tr>
      </thead>
      <tbody>
        {
          showCat
        }
      </tbody>
    </table>
  </div>
  )
}

export default CategoryAdmin