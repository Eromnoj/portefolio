import React, { useEffect, useState } from 'react'
import styles from '@/styles/Navbar.module.scss'
import { FC } from 'react'
import Link from 'next/link'
import type { NavbarProps } from '@/lib/types/props'
import { useRouter } from 'next/router'

const Navbar: FC<NavbarProps> = ({ showContact, responsive, toggle }) => {

  const [stylesNav, setStylesNav] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {

    if (responsive) {
      if (toggle){
        setStylesNav([styles.navListResponsive, styles.navListDown])
      } else {
        setStylesNav([styles.navListResponsive])
      }
    } else {
      setStylesNav([styles.navList])
    }
  }, [responsive, toggle])

  return (
    <nav className={styles.navBar}>
      <ul className={stylesNav.join(' ')}>
        <li className={[styles.navItem].join(' ')}><Link href='/#portefolio' className={[styles.medFont].join(' ')}>Portefolio</Link></li>
        <li className={[styles.navItem].join(' ')}><Link href='/#curriculum' className={[styles.medFont].join(' ')}>Curriculum</Link></li>
        {
          router.pathname === '/admin' ? 
          
          <li className={[styles.navItem].join(' ')}><Link href='/api/auth/signout' className={[styles.medFont].join(' ')} >Déconnexion</Link></li>
          :
          <li className={[styles.navItem].join(' ')} onClick={showContact}><p className={[styles.medFont].join(' ')} style={{cursor: "pointer"}}>Contact</p></li>

        }
      </ul>
    </nav>
  )
}

export default Navbar