import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Declaration.module.css'
import { useRouter } from 'next/router'
import Declaration from '../c/Declaration'

const Home: NextPage = () => {
  const { query } = useRouter()
  const { text, size = '1600px', address } = query

  return (
    <div className={styles.page}>
      <Declaration size={size.toString()} address={address}>
        {text?.toString()}
      </Declaration>
    </div>
  )
}

export default Home
