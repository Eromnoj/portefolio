import React, { FC, FormEvent, useState } from 'react'
import type { WebEntryProps } from '@/lib/types/props'
import axios from 'axios'
import { myLoader, myAssets } from '@/lib/utils/function'
import Image from 'next/image'
import styles from '@/styles/CategoryRow.module.scss'


const WebRows: FC<WebEntryProps> = ({ id, url, alt, logo, getWebs }) => {

  const [imageUpdate, setImageUpdate] = useState<string | Blob>()
  const [urlUpdate, setUrlUpdate] = useState(url)
  const [altUpdate, setAltUpdate] = useState(alt)

  const handleUpdate = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    const data = new FormData()
    if (imageUpdate !== undefined) {
      data.append('image', imageUpdate)
    }
    data.append('url', urlUpdate)
    data.append('alt', altUpdate)
    try {
      const res = await axios.post(`/api/admin/web/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const resData = await res.data
      getWebs()

    } catch (error: any) {
      console.error(error?.response.data.message);

    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/web/${id}`)

      const data = await res.data
      getWebs()

    } catch (error) {
      console.error(error);

    }
  }

  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false)

  return (
    <>
      <tr>
        <td>{url}</td>
        <td>
          <Image
            loader={myLoader}
            src={logo}
            alt={alt}
            width={80}
            height={80}
            quality={100}
            style={{
              objectFit: 'contain'
            }} />
        </td>
        <td>{alt}</td>
        <td><div onClick={() => setUpdateFormVisible(prev => !prev)}>
          <Image
            loader={myAssets}
            src={'Edit-alt.png'}
            alt={`Edit ${url}`}
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
              alt={`Remove ${url}`}
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
                  <label htmlFor="image" className={styles.contentFont}>Logo</label>
                  <input type="file" name="image" id="image" onChange={(e) => {
                    if (e.target.files !== null) {
                      setImageUpdate(e.target.files[0])

                    }
                  }} />
                </div>
                <div>
                  <label htmlFor="url" className={styles.contentFont} >url</label>
                  <input type="text" name="url" id="url" value={urlUpdate} onChange={(e) => setUrlUpdate(e.target.value)} />
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

export default WebRows