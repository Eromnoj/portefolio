import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Cards from './Card'
import CategoryBox from './CategoryBox'
import styles from '@/styles/Projects.module.scss'
import axios from 'axios'
import { CategoryBoxFilterProps, ProjectBoxProps } from '@/lib/types/props'
import gsap from 'gsap'
import CustomEase from 'gsap/dist/CustomEase'
gsap.registerPlugin(CustomEase)

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


  const categoriesRefs = useRef<any[]>([])

  useEffect(() => {
    let ctxSelect = gsap.context(() => {
      const anim = (el:any) => {
        let catTl = gsap.timeline();
        return catTl
          .to(el, {
            duration: 0.1,
            scale: 1.2
          })
          .to(el, {
            duration: 0.2,
            scale: 1
          });
      };
      categoriesRefs.current.forEach((selector) => {
        if (selector !== null) {
          selector.animation = anim(selector);
          selector.addEventListener("click", () => {
            selector.animation.restart();
          });
        }
      });
    });
    return () => ctxSelect.revert();
  }, [categories]);


  const projectsRefs = useRef<any[]>([])

  useEffect(() => {
    let ctxCards = gsap.context(() => {      
      let proTl = gsap.timeline({ paused: true });
      projectsRefs.current.forEach((selector) => {
        if(selector !== null){

          proTl.from(selector, {
            duration: 0.4,
            x: 1100,
            opacity:0,
            stagger: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,1.069 0.362,1.106 0.37,1.091 0.471,0.748 0.512,0.686 0.567,0.601 0.595,0.653 0.608,0.662 0.684,0.712 0.719,1.063 0.726,1.08 0.788,0.996 0.84,0.936 0.859,0.95 0.878,0.964 0.897,0.985 0.911,0.998 0.922,0.994 0.939,0.984 0.954,0.984 0.969,0.984 1,1 1,1 ")
          })
        }
      });
      proTl.restart()
    });
    return () => ctxCards.revert();
  }, [projects]);

  const catFilter = categories.map((cat, index) => {
    return (
      <div
      key={cat.id}
      ref={(cat) => categoriesRefs.current[index] = cat}
      >

        <CategoryBox
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
      </div>
    )

  })


  const showProject = projects.map((project, index) => {
    return (
      <div
      key={project.id}
      ref={(cat) => projectsRefs.current[index] = cat} 
      >

      <Cards
        name={project.name}
        image={project.image}
        description={project.description}
        url={project.url}
        categories={project.categories}
        />
        </div>
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