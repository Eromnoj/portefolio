import styles from '@/styles/Admin.module.scss'
import { useEffect, useState } from 'react'
import ContactForm from '@/components/ContactForm'
import Navbar from '@/components/Navbar'
import {useSession } from "next-auth/react"
import CategoryAdmin from '@/components/admin/CategoryAdmin'
import ProjectsAdmin from '@/components/admin/ProjectsAdmin'
import CurriculumAdmin from '@/components/admin/CurriculumAdmin'
import WebAdmin from '@/components/admin/WebAdmin'
import PresentationAdmin from '@/components/admin/PresentationAdmin'


export default function AdminDashBoard() {

  const {data: session, status} = useSession()

  const [showContact, setShowContact] = useState(false)

  // Manage responsive menu
  const [windowWidth, setWindowWidth] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [responsive, setResponsive] = useState(false)
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    windowWidth >= 680 ? setResponsive(false) : setResponsive(true)
    windowWidth <= 680 ? setToggle(false) : setToggle(true)
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
    return () => window.removeEventListener('resize', () => setWindowWidth(window.innerWidth))
  }, [windowWidth])

  if (status === "authenticated") {
  return (
    <>
      {showContact ?
        <ContactForm
          hideContact={() => setShowContact(false)}
        />
        : null}
      <header>
        {
          windowWidth <= 680 ?
            <div className={styles.toggleMenu} onClick={() => setToggle(prev => !prev)}><p className={styles.medFont}>Menu</p></div>
            : null
        }
        {windowWidth >= 680 && !toggle ?
          <Navbar
            showContact={() => setShowContact(true)}
            responsive={responsive}
          />
          :
          <Navbar
            showContact={() => setShowContact(true)}
            responsive={responsive}
            toggle={toggle}
          />
        }
      </header>
      <main>
  
        <h2 className={[styles.titleFont].join(' ')}>Admnistration</h2>

        <CategoryAdmin />

        <ProjectsAdmin />

        <CurriculumAdmin />

        <WebAdmin />

        <PresentationAdmin />
      </main>
    </>
  )
  }

  return (
    <>
    <h1 className={styles.titleFont}>Accès non autorisé</h1>
    <p className={styles.medFont}>Nan, mais tu t&apos;es cru où ?</p>
    </>
  )
}
