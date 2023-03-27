import React, { useEffect, useState } from 'react'
import Cards from './Card'
import CategoryBox from './CategoryBox'
import styles from '@/styles/Projects.module.scss'
import axios from 'axios'
import { CategoryBoxFilterProps, ProjectBoxProps } from '@/lib/types/props'

const Projects = () => {

  const [categories, setCategories] = useState<Array<CategoryBoxFilterProps>>([])
  const [projects, setProjects] = useState<Array<ProjectBoxProps>>([])

  const [filters, setFilters] = useState<String[]>([])


  const getCategories = async () => {
    try {
      const res = await axios.get('/api/admin/category')
      const data = res.data

      setCategories(data.data)

    } catch (error) {

    }

  }

  const getProjects = async (filters: String[]) => {
    try {
      const res = await axios.get(`/api/admin/project/filter?filter=${filters}`)

      const data = res.data
      setProjects(data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    let ignore = false
    if (!ignore) {

      getCategories()
    }
    return () => {
      ignore = true
    }
  }, [])


  useEffect(() => {
    let ignore = false
    if (!ignore) {

      getProjects(filters)
    }
    return () => {
      ignore = true
    }
  }, [filters])

  const catFilter = categories.map(cat => {
    return (

      <CategoryBox
        key={cat.id}
        id={cat.id}
        image={cat.image}
        alt={cat.alt}
        onClick={
          () => {

            setFilters(prev => {
              if (prev.includes(cat.id)) {
                return prev.filter(item => item != cat.id)
              } else {

                return [...prev, cat.id]
              }
            })
          }
        }
      />
    )

  })

  const showProject = projects.map(project => {
    return (
      <Cards
        key={project.id}
        name={project.name}
        image={project.image}
        description={project.description}
        url={project.url}
        categories={project.categories}
      />
    )
  })
  return (
    <div className={[styles.projet].join(' ')}>
      <h2 className={[styles.titleFont].join(' ')}>Projet</h2>
      <div className={styles.filter}>
        <p className={styles.medFont}>Filtrer par catégories :</p>
        <div className={styles.categories}>
          {
            catFilter
          }
        </div>
      </div>
      <div className={[styles.cardShowCase].join(' ')}>
        {
          showProject
        }
      </div>
    </div>
  )
}

export default Projects