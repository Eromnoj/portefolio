import React, { FC, FormEvent, useEffect, useState } from 'react'
import type { ProjectRowProps } from '@/lib/types/props'
import axios from 'axios'
import { myLoader, myAssets } from '@/lib/utils/function'
import Image from 'next/image'
import styles from '@/styles/ProjectRow.module.scss'
import type { CategorySelect } from '@/lib/types/state'


const ProjectRow: FC<ProjectRowProps> = ({ id, name, description, image, url, categories, categoriesList, getProject }) => {

  const [imageUpdate, setImageUpdate] = useState<string | Blob>()
  const [nameUdate, setNameUpdate] = useState(name)
  const [descriptionUpdate, setDescriptionUpdate] = useState(description)
  const [urlUpdate, setUrlUpdate] = useState(url)
  const [categoriesUpdate, setCategoriesUpdate] = useState<CategorySelect[]>([])

  useEffect(()=> {
    setCategoriesUpdate(categoriesList.map(cat => {
      let isPresent = false
      let item = {
        id: cat.id,
        name: cat.name,
        checked: isPresent
      }
      categories.forEach(category => { 
          isPresent = category.id === cat.id ? true : false
          if (isPresent) {
            item.checked = isPresent
            return
          }
      })
      return item
    }))
  },[categories, categoriesList])

  
  const handleUpdate = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const data = new FormData()
    if (imageUpdate !== undefined) {
      data.append('image', imageUpdate)
    }
    data.append('name', nameUdate)
      data.append('description', descriptionUpdate)
      data.append('url', urlUpdate)
      data.append('categories', categoriesUpdate.filter(cat => cat.checked === true).map(cat => cat.id).join('//'))
    try {
      const res = await axios.post(`/api/admin/project/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const resData = await res.data

      getProject()

    } catch (error: any) {
      console.error(error?.response.data.message);

    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/project/${id}`)

      const data = await res.data

      getProject()

    } catch (error) {
      console.error(error);

    }
  }

  const handleCategoryChange = (id: string) => {
    setCategoriesUpdate(prev => {
      return prev.map(category => {
        return {
          id: category.id,
          name: category.name,
          checked: category.id === id ? !category.checked : category.checked
        }
      })
    })
  }

  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false)

  return (
    <>
      <tr>
        <td>{name}</td>
        
        <td>
          <Image
            loader={myLoader}
            src={image}
            alt={name}
            width={80}
            height={80}
            quality={100}
            style={{
              objectFit: 'contain'
            }} />
        </td>
        <td>{url}</td>
        <td><ul>
          {
            categories.map(category => {
              return (
                <li key={`${category.id}-${id}`}>{category.alt}</li>
              )
            })
          }
          </ul></td>
        <td><div onClick={() => setUpdateFormVisible(prev => !prev)}>
          <Image
            loader={myAssets}
            src={'Edit-alt.png'}
            alt={`Edit ${name}`}
            width={50}
            height={50}
            quality={100}
            style={{
              objectFit: 'contain'
            }} />
        </div>
        </td>
        <td>
          <div onClick={() => {
            handleDelete(id)
          }}><Image
              loader={myAssets}
              src={'Trash-alt.png'}
              alt={`Remove ${name}`}
              width={50}
              height={50}
              quality={100}
              style={{
                objectFit: 'contain'
              }} /></div>
        </td>
      </tr>
      {
        updateFormVisible ?
          <tr>
            <td colSpan={6}>
            <form
        className={styles.tableForm}
        encType='multipart/form-data' onSubmit={(e) => {
          e.preventDefault()
          handleUpdate(e, id)
        }
        }>
        <div>
          <label htmlFor="image" className={styles.contentFont}>Image</label>
          <input type="file" name="image" id="image" onChange={(e) => {
            if (e.target.files !== null) {
              setImageUpdate(e.target.files[0])

            }
          }} />
        </div>
        <div>
          <label htmlFor="name" className={styles.contentFont} >Nom</label>
          <input type="text" name="name" id="name" value={nameUdate} onChange={(e) => setNameUpdate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className={styles.contentFont} >Description</label>
          <input type="text" name="description" id="description" value={descriptionUpdate} onChange={(e) => setDescriptionUpdate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="url" className={styles.contentFont} >Url</label>
          <input type="text" name="url" id="url" value={urlUpdate} onChange={(e) => setUrlUpdate(e.target.value)} />
        </div>
        <div>
          <h2 className={styles.medFont}>Catégories :</h2>
          {
            categoriesUpdate.map((category, index) => {
              return (
                <div key={index}>
                  <label className={styles.contentFont} htmlFor={category.name}>{category.name}</label>
                  <input type="checkbox"
                    name={category.name}
                    id={category.id}
                    value={category.id}
                    checked={category.checked}
                    onChange={() => handleCategoryChange(category.id)} />
                </div>
              )
            })
          }
        </div>
        <div>

          <input type="submit" value="Envoyer" className={styles.contentFont} />
        </div>
      </form>
            </td>
          </tr>

          : null
      }
    </>
  )
}

export default ProjectRow