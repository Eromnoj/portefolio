import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '@/styles/AdminSection.module.scss'
import { CurriculumEntryProps } from '@/lib/types/props'
import CurriculumRow from './CurriculumRow'


const CurriculumAdmin = () => {

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [occupation, setOccupation] = useState('')
  const [society, setSociety] = useState('')



  const handleSubmit = async () => {
    const data = {
      startDate,
      endDate,
      occupation,
      society
    }
    try {
      const res = await axios.post('/api/admin/curriculum', data)

      const resData = await res.data
      getCurriculae()

      console.log(resData);

    } catch (error: any) {
      console.error(error?.response.data.message);

    }
  }


  const [curriculae, setCurriculae] = useState<Array<CurriculumEntryProps>>([])


  const getCurriculae = async () => {
    try {
      const res = await axios.get('/api/admin/curriculum')
      const data = res.data
      setCurriculae(data.data)
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCurriculae()
  }, [])


  const showCurriculae = curriculae.map(curriculum => {
    return (
      <CurriculumRow 
        key={curriculum.id}
        id={curriculum.id}
        startDate={curriculum.startDate}
        endDate={curriculum.endDate}
        occupation={curriculum.occupation}
        society={curriculum.society}
        getCurriculae={getCurriculae}
      />
    )
  })


return (
  <div className={styles.adminSection}>

    <h3 className={styles.medFont}>Ajouter une entrée au CV</h3>
    <form
      className={styles.adminForm} onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }
      }>
      <div>
        <label htmlFor="startDate" className={styles.contentFont} >Date de début</label>
        <input type="date" name="startDate" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="endDate" className={styles.contentFont} >Date de fin</label>
        <input type="date" name="endDate" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="occupation" className={styles.contentFont} >Poste</label>
        <input type="text" name="occupation" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      </div>
      <div>
        <label htmlFor="society" className={styles.contentFont} >Societé</label>
        <input type="text" name="society" id="society" value={society} onChange={(e) => setSociety(e.target.value)} />
      </div>
      <div>

        <input type="submit" value="Envoyer" className={styles.contentFont} />
      </div>
    </form>

    <h3 className={styles.medFont}>Gérer le CV</h3>
    <table className={styles.adminTable}>
      <thead>
        <tr>
          <th>Début</th>
          <th>Fin</th>
          <th>Poste</th>
          <th>Société</th>
          <th>Modifier</th>
          <th>supprimer</th>
        </tr>
      </thead>
      <tbody>
        {
          showCurriculae
        }
      </tbody>
    </table>
  </div>
)
}

export default CurriculumAdmin