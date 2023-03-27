import React, { useEffect, useState } from 'react'
import styles from '@/styles/Web.module.scss'
import WebEntry from './WebEntry'
import axios from 'axios'
import { WebEntryType } from '@/lib/types/props'

const Web = () => {

  const [webs, setWebs] = useState<Array<WebEntryType>>([])



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
      <WebEntry 
      key={web.id}
      id={web.id }
      logo={web.logo} 
      alt={web.alt} 
      url={web.url} />
    )
  })


  return (
    <div className={[styles.web].join(' ')}>
      <h2 className={[styles.titleFont].join(' ')}>Sur le web</h2>
      <div className={[styles.socialList].join(' ')}>
      {
        showWebs
      }
      </div>
    </div>
  )
}

export default Web