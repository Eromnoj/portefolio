import { WebEntryProps } from '@/lib/types/props'
import axios from 'axios'
import React, { FormEvent, useEffect, useState } from 'react'
import WebRow from './WebRow'
import styles from '@/styles/AdminSection.module.scss'


const WebAdmin = () => {

  const [image, setImage] = useState<string | Blob>()
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData()
    if (image !== undefined) {
      data.append('image', image)
      data.append('url', url)
      data.append('alt', alt)

      try {
        const res = await axios.post('/api/admin/web', data, {
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
  }

  const [webs, setWebs] = useState<Array<WebEntryProps>>([])


   
  const getWebs = async () => {
    try {
      const res = await axios.get('/api/admin/web')
      const data = res.data      
      setWebs(data.data)
    } catch (error: any) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    getWebs()
  }, [])
  
  const showWebs = webs.map(web => {
    return (
      <WebRow
        key={web.id}
        id={web.id}
        alt={web.alt}
        logo={web.logo}
        url={web.url}
        getWebs={getWebs}
      />
    )
  })
  return (
    <div className={styles.adminSection}>

    <h3 className={styles.medFont}>Ajouter un lien web</h3>
    <form
      className={styles.adminForm}
      encType='multipart/form-data' onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }
      }>
      <div>
        <label htmlFor="image" className={styles.contentFont}>Logo</label>
        <input type="file" name="image" id="image" onChange={(e) => {
          if (e.target.files !== null) {
            setImage(e.target.files[0])

          }
        }} />
      </div>
      <div>
        <label htmlFor="url" className={styles.contentFont} >Url</label>
        <input type="text" name="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div>
        <label htmlFor="alt" className={styles.contentFont} >Alt</label>
        <input type="text" name="alt" id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
      </div>
      <div>
        <input type="submit" value="Envoyer" className={styles.contentFont} />
      </div>
    </form>

    <h3 className={styles.medFont}>Gérer les lien web</h3>
    <table className={styles.adminTable}>
      <thead>
        <tr>
          <th>url</th>
          <th>logo</th>
          <th>alt</th>
          <th>Modifier</th>
          <th>supprimer</th>
        </tr>
      </thead>
      <tbody>
        {
          showWebs
        }
      </tbody>
    </table>
  </div>
  )
}

export default WebAdmin