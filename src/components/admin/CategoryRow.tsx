import React, { FC, FormEvent, useState } from 'react'
import type { CategoryRowProps } from '@/lib/types/props'
import axios from 'axios'
import { myLoader, myAssets } from '@/lib/utils/function'
import Image from 'next/image'
import styles from '@/styles/CategoryRow.module.scss'


const CategoryRow: FC<CategoryRowProps> = ({ id, alt, image, getCategories }) => {

  const [imageUpdate, setImageUpdate] = useState<string | Blob>()
  const [altUpdate, setAltUpdate] = useState(alt)


  const handleUpdate = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const data = new FormData()
    if (imageUpdate !== undefined) {
      data.append('image', imageUpdate)
    }
    data.append('alt', altUpdate)
    try {
      const res = await axios.post(`/api/admin/category/${id}`, data, {
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

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/category/${id}`)

      const data = await res.data
      getCategories()

    } catch (error) {
      console.error(error);

    }
  }

  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false)

  return (
    <>
      <tr>
        <td>{alt}</td>
        <td>
          <Image
            src={image}
            alt={alt}
            width={80}
            height={80}
            quality={100}
            style={{
              objectFit: 'contain'
            }} />
        </td>
        <td><div onClick={() => setUpdateFormVisible(prev => !prev)}>
          <Image
            loader={myAssets}
            src={'Edit-alt.png'}
            alt={`Edit ${alt}`}
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
              alt={`Remove ${alt}`}
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
            <td colSpan={4}>
              <form
                className={styles.tableForm}
                encType='multipart/form-data' onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdate(e, id)
                  setUpdateFormVisible(prev => !prev)
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
                  <label htmlFor="alt" className={styles.contentFont} >Alt</label>
                  <input type="text" name="alt" id="alt" value={altUpdate} onChange={(e) => setAltUpdate(e.target.value)} />
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

export default CategoryRow