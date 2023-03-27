import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/AdminSection.module.scss'


const PresentationAdmin = () => {

  const [presentation, setPresentation] = useState('')



  const handleSubmit = async () => {
    const data = {
      presentation: presentation
    }
    try {
      const res = await axios.post('/api/admin/presentation', data)

      const resData = await res.data
      getPresentation()

      console.log(resData);

    } catch (error: any) {
      console.error(error?.response.data.message);

    }
  }


  const getPresentation = async () => {
    try {
      const res = await axios.get('/api/admin/presentation')
      const data = res.data
      if (data.data.length > 0) {
        setPresentation(data.data[0].presentation)
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPresentation()
  }, [])


  return (
    <div className={styles.adminSection}>

      <h3 className={styles.medFont}>Gérer la présentation</h3>
      <form
        className={styles.adminForm} onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }
        }>
        <div>
          <label htmlFor="society" className={styles.contentFont} >présentation</label>

          <textarea name="society" id="" cols={30} rows={10}  value={presentation} onChange={(e) => setPresentation(e.target.value)}></textarea>
        </div>
        <div>

          <input type="submit" value="Envoyer" className={styles.contentFont} />
        </div>
      </form>
    </div>
  )
}

export default PresentationAdmin