import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useEffect, useState } from 'react'
import Projects from '@/components/Projects'
import Curriculum from '@/components/Curriculum'
import Web from '@/components/Web'
import Presentation from '@/components/Presentation'
import ContactForm from '@/components/ContactForm'
import Navbar from '@/components/Navbar'
import GlassesSVG from '@/components/GlassesSVG'

export default function Home() {


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



        <div className={styles.headerContent}>
          <h1 className={[styles.headerName, styles.titleFont].join(' ')}>Jonathan Moreschi</h1>
          <GlassesSVG />
        </div>
      </header>
      <main>
        <section className={[styles.section].join(' ')}>
          <Presentation />
        </section>
        <section className={[styles.section].join(' ')} id='portefolio'>
          <Projects />
        </section>
        <section className={[styles.section].join(' ')} id='curriculum'>
          <Curriculum />
        </section>
        <section className={[styles.section].join(' ')}>
          <Web />
        </section>

      </main>
      <footer className={[styles.footer].join(' ')}>
        <p className={styles.contentFont}>&copy; Jonathan Moreschi</p>
      </footer>

    </>
  )
}
