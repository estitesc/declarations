import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Declaration.module.css'
import { useRouter } from 'next/router'
import Declaration from '../c/Declaration'

const Home: NextPage = () => {
  const {query} = useRouter()
  const {text, size = '75vh'} = query

  return (
    <div className={styles.page}>
      <Declaration size={size}>{text}</Declaration>
    </div>
  )
}

export default Home
