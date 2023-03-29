import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { useEffect, useRef, useState } from 'react'
import Projects from '@/components/Projects'
import Curriculum from '@/components/Curriculum'
import Web from '@/components/Web'
import Presentation from '@/components/Presentation'
import dynamic from 'next/dynamic'

const ContactForm = dynamic(()=> import('../components/ContactForm'), {
  ssr: false
})
// import ContactForm from '@/components/ContactForm'
import Navbar from '@/components/Navbar'
import GlassesSVG from '@/components/GlassesSVG'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)


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

  const title = useRef(null)

  useEffect(() => {
     let ctxName = gsap.context(() => {

       gsap.from(".gsap_title", {
         duration: 0.7,
         delay: 0.3,
         xPercent: -250,
         stagger: 0.5,
         ease: "bounce.out"}) 
      })
      return () => ctxName.revert()
  }, [])


  const sectionRefs = useRef<any[]>([])
  useEffect(()=> {

    let ctxScroll = gsap.context(() => {

      sectionRefs.current.forEach((el, index) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger:el,
            start: "top bottom",
            end:"30% bottom",
            toggleActions:"play none none reverse",
          },
          y: 500,
          opacity: 0,
          duration: 0.5
        })
      })


    })
    return ()=> ctxScroll.revert()
  }, [])
  return (
    <>
    <Head>
      <title>Jonathan Moreschi : Le Portefolio</title>
      <meta property="og:title" content="Jonathan Moreschi: le Porteflio" key="title" />
      <meta name="description" content="Développeur web fullstack, au service de vos projets" />
      <meta property="og:placename" content="Argeles sur Mer" />
      <meta property='og:url' content='https://jomoreschi.fr' />
    </Head>
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
          <h1 className={[styles.headerName, styles.titleFont].join(' ')}><div className='gsap_title'>Jonathan</div><div className='gsap_title'>Moreschi</div></h1>
          <GlassesSVG />
        </div>
      </header>
      <main>

        <section className={[styles.section].join(' ')}>
          <Presentation />
        </section>
        <section className={[styles.section].join(' ')} 
        ref={el => sectionRefs.current[0] = el} 
        id='portefolio'>
          <Projects />
        </section>
        <section className={[styles.section].join(' ')}
        ref={el => sectionRefs.current[1] = el} 
        id='curriculum'>
          <Curriculum />
        </section>
        <section className={[styles.section].join(' ')}
        ref={el => sectionRefs.current[2] = el} 
        
        >
          <Web />
        </section>

      </main>
      <footer className={[styles.footer].join(' ')}>
        <p className={styles.contentFont}>&copy; Jonathan Moreschi</p>
      </footer>

    </>
  )
}
