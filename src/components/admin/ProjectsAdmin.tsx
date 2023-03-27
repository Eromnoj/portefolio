import { ProjectBoxProps, CategoryBoxProps } from '@/lib/types/props'
import axios from 'axios'
import React, { FormEvent, useEffect, useState } from 'react'
import ProjectRow from './ProjectRow'
import styles from '@/styles/AdminSection.module.scss'
import type { CategorySelect } from '@/lib/types/state'

const ProjectsAdmin = () => {

  const [image, setImage] = useState<string | Blob>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const [categories, setCategories] = useState<CategorySelect[]>([])

  
  const handleCategoryChange = (id: string) => {
    setCategories(prev => {
      return prev.map(category => {
        return {
          id: category.id,
          name: category.name,
          checked: category.id === id ? !category.checked : category.checked
        }
      })
    })
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData()
    if (image !== undefined) {
      data.append('image', image)
      data.append('name', name)
      data.append('description', description)
      data.append('url', url)
      data.append('categories', categories.filter(cat => cat.checked === true).map(cat => cat.id).join('//'))
      try {
        const res = await axios.post('/api/admin/project', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const resData = await res.data
        getProjects()

      } catch (error: any) {
        console.error(error?.response.data.message);

      }
    }
  }

  const [projects, setProjects] = useState<Array<ProjectBoxProps>>([])



  const getProjects = async () => {
    try {
      const res = await axios.get('/api/admin/project')
      const data = res.data
      setProjects(data.data)
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  const getCategories = async () => {
    try {
      const res = await axios.get('/api/admin/category')
      const data = res.data      
      setCategories(data.data.map((category:CategoryBoxProps) => {
        return   {
            id: category.id,
            name: category.alt,
            checked: false
          }
      }))

    } catch (error: any) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    getCategories()
  }, [])

  const showProjects = projects.map(project => {
    return (
      <ProjectRow
        key={project.id}
        id={project.id}
        image={project.image}
        name={project.name}
        description={project.description}
        categories={project.categories}
        categoriesList={categories}
        url={project.url}
        getProject={getProjects}
      />
    )
  })
  return (
    <div className={styles.adminSection}>

      <h3 className={styles.medFont}>Ajouter un projet</h3>
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
          <label htmlFor="name" className={styles.contentFont} >Nom</label>
          <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className={styles.contentFont} >Description</label>
          <input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="url" className={styles.contentFont} >Url</label>
          <input type="text" name="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <h2 className={styles.medFont}>Catégories :</h2>
          {
            categories.map((category, index) => {
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


          <input type="submit" value="Envoyer" className={styles.contentFont} />
        </div>
      </form>

      <h3 className={styles.medFont}>Gérer les projets</h3>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Image</th>
            <th>Url</th>
            <th>Catégories</th>
            <th>Modifier</th>
            <th>supprimer</th>
          </tr>
        </thead>
        <tbody>
          {
            showProjects
          }
        </tbody>
      </table>
    </div>
  )
}

export default ProjectsAdmin