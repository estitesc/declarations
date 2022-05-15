import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Declaration, { Background } from '../c/Declaration'
import DeclarationOfIndependence from '../c/DeclarationOfIndependence'
import clsx from 'clsx'

const MemoizedBackground = React.memo(Background)

const Home: NextPage = () => {
  const [showDeclaration, setShowDeclaration] = React.useState(false)
  const toggle = () => setShowDeclaration(!showDeclaration)

  return (
    <div className={styles.container}>
      <div>
        <MemoizedBackground className={styles.background} />

        <header className={styles.header}>
          <h1 className={styles.title + ' fluid-type'}>
            <span>Re</span>declarations
          </h1>
          <p className={styles.subtitle + ' fluid-type'}>
            A reclaiming of the Declaration of Independence by those who never
            signed it.
          </p>
        </header>

        <div className={styles.intro}>
          <p className={styles.dropCap}>
            The{' '}
            <button
              onClick={toggle}
              className={clsx(
                styles.declarationLink,
                showDeclaration && styles.declarationLinkSelected
              )}
            >
              Declaration of Independence
            </button>{' '}
            marked America’s exit from the British Empire. Redeclarations are an
            invitation to depart again, break from today’s America and embrace a
            redefined nation. By minting bits of the old declaration, we’re
            taking ownership of this nation’s founding document and redeclaring
            this country.
          </p>

          <p>
            A revolution never concludes. A country is an eternal dream dreamt
            by all its people, old and new. Out of the 56 signatories of the
            original declaration, 8 were immigrants. None were Natives.
            Redeclarations resets and corrects the beginnings of this country by
            giving all of its parts a voice.
          </p>
        </div>

        <form>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            placeholder='Enter your email address'
            autoComplete='email'
            className={styles.textInput}
          />
        </form>

        <div className={styles.intro}>
          <p>
            The new signatories will be able to select the words and sentences
            of the Declaration that speak to them. Their selections will be a
            collective erasure of the past, a revealing of new potential
            meanings within the original document and a seeding of kernels of
            unexplored futures.
          </p>

          <p>
            As the project evolves, the declaration will evolve into a
            marked—and colorful—document, a communitarian revision of the
            original where each signatory can claim a literal space and a
            colorscape.
          </p>
        </div>

        <div className={styles.oulipo}>
          xoxo,
          <br /> — 0u1ip0
        </div>
      </div>

      {showDeclaration && <DeclarationOfIndependence />}

      {/* <div className={styles.declarationGrid}>
        {Array.from(Array(100)).map((i) => (
          <Declaration key={i}>
            Government becomes destructive of these ends, it is the Right of the
            People to alter
          </Declaration>
        ))}
        <Declaration>
          Government becomes destructive of these ends, it is the Right of the
          People to alter
        </Declaration>

        <Declaration>
          We hold these truths to be self-evident, that all men are created
          equal, that they are endowed by their Creator with certain unalienable
          Rights, that among these are Life, Liberty and the pursuit of
          Happiness.
        </Declaration>

        <Declaration>
          experience hath shewn, that mankind are more disposed to suffer, while
          evils are sufferable, than to right themselves by abolishing the forms
        </Declaration>
      </div> */}
    </div>
  )
}

export default Home
