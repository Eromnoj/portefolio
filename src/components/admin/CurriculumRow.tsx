import React, { FC, useState } from 'react'
import type { CurriculumRowProps } from '@/lib/types/props'
import axios from 'axios'
import { myAssets } from '@/lib/utils/function'
import Image from 'next/image'
import styles from '@/styles/CurriculumRow.module.scss'


const CurriculumRow: FC<CurriculumRowProps> = ({ id, startDate, endDate, occupation, society, getCurriculae }) => {

  const [startDateUpdate, setStartDateUpdate] = useState(`${new Date(startDate).getFullYear()}-${new Date(startDate).getMonth() + 1 >= 10 ? new Date(startDate).getMonth() + 1 : '0'+(new Date(startDate).getMonth() + 1)}-${new Date(startDate).getDate()}`)
  const [endDateUpdate, setEndDateUpdate] = useState(`${new Date(endDate).getFullYear()}-${new Date(endDate).getMonth() + 1 >= 10 ? new Date(endDate).getMonth() + 1 : '0'+(new Date(endDate).getMonth() + 1)}-${new Date(endDate).getDate()}`)
  const [occupationUpdate, setOccupationUpdate] = useState(occupation)
  const [societyUpdate, setSocietyUpdate] = useState(society)



  const handleUpdate = async () => {
    const data = {
      startDate: startDateUpdate,
      endDate: endDateUpdate,
      occupation: occupationUpdate,
      society: societyUpdate
    }
    try {
      const res = await axios.patch(`/api/admin/curriculum/${id}`, data)

      const resData = await res.data

      getCurriculae()

    } catch (error: any) {
      console.error(error?.response.data.message);

    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/curriculum/${id}`)

      const data = await res.data

      getCurriculae()

    } catch (error) {
      console.error(error);

    }
  }


  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false)

  const startString = `${new Date(startDate).getFullYear()}-${new Date(startDate).getMonth() + 1 >= 10 ? new Date(startDate).getMonth() + 1 : '0'+(new Date(startDate).getMonth() + 1)}-${new Date(startDate).getDate()}`

  const endString = `${new Date(endDate).getFullYear()}-${new Date(endDate).getMonth() + 1 >= 10 ? new Date(endDate).getMonth() + 1 : '0'+(new Date(endDate).getMonth() + 1)}-${new Date(endDate).getDate()}`
  return (
    <>
      <tr>
        <td>{startString}</td>

        <td>{endString}</td>
        <td>{occupation}</td>
        <td>{society}</td>
        <td><div onClick={() => setUpdateFormVisible(prev => !prev)}>
          <Image
            loader={myAssets}
            src={'Edit-alt.png'}
            alt={`Edit ${occupation}`}
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
              alt={`Remove ${occupation}`}
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
                className={styles.tableForm} onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdate()
                }
                }>
                <div>
                  <label htmlFor="startDate" className={styles.contentFont} >Date de début</label>
                  <input type="date" name="startDate" id="startDate" value={startDateUpdate} onChange={(e) => setStartDateUpdate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="endDate" className={styles.contentFont} >Date de fin</label>
                  <input type="date" name="endDate" id="endDate" value={endDateUpdate} onChange={(e) => setEndDateUpdate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="occupation" className={styles.contentFont} >Poste</label>
                  <input type="text" name="occupation" id="occupation" value={occupationUpdate} onChange={(e) => setOccupationUpdate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="society" className={styles.contentFont} >Societé</label>
                  <input type="text" name="society" id="society" value={societyUpdate} onChange={(e) => setSocietyUpdate(e.target.value)} />
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

export default CurriculumRow