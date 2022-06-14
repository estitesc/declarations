import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Mint.module.css'
import clsx from 'clsx'
import { Logo } from '../c/Logo'
import TextSelector from '../c/TextSelector'
import { declarationText } from '../utils/declarationText'
import useConnectWallet from '../h/useConnectWallet'
import Declaration from '../c/Declaration'
import useMint from '../h/useMint'

const Mint: NextPage = () => {
  const [selection, setSelection] = React.useState<any>({})
  const [textSelKey, setTextSelKey] = React.useState(0)
  const [walletAddress, setWalletAddress] = React.useState<string | undefined>(
    undefined
  )
  const [loading, setLoading] = React.useState(false)

  const { mint } = useMint()

  const onChange = React.useCallback((selection: any) => {
    setSelection(selection)
  }, [])

  const connectWallet = useConnectWallet()
  const connectWalletAndStoreAddress = React.useCallback(async () => {
    const address = await connectWallet()
    setWalletAddress(address)
  }, [connectWallet])

  const generateAndMint = React.useCallback(async () => {
    if (loading) {
      return
    }
    setLoading(true)

    const declarationBackground = document.getElementById(
      'declaration-background'
    )?.outerHTML

    const params = {
      text: selection.text.trim(),
      address: walletAddress,
      width: '1600',
      height: '1600',
      background: declarationBackground
    }

    console.log('params are', params)

    //@ts-ignore
    const paramString = new URLSearchParams(params).toString()
    const generateAndPinUrl = `https://screenshot-khaki.vercel.app/api?url=https://www.redeclarations.com/declaration?${new URLSearchParams(
      paramString
    ).toString()}`
    console.log('generate and pin URL is', generateAndPinUrl)

    const response = await fetch(generateAndPinUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('got response after generating and pinning the image', response)

    const data = await response.json()
    const imageUrl = data.result

    console.log('now trying to mint with', imageUrl, selection.indices)
    mint(imageUrl, selection.indices)

    setLoading(false)
  }, [mint, selection.indices, selection.text, walletAddress, loading])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <header className={styles.header}>
            <Logo className={styles.logo} />
            {/* <p
              className={clsx(styles.subtitle, 'fluid-type')}
              style={{ marginBottom: '0.75em', marginTop: '1em' }}
            >
              A reclaiming of the Declaration of Independence by those who never
              signed it.
            </p>
            <p
              className={clsx(styles.subtitle, 'fluid-type')}
              style={{ marginBottom: '0.75em', marginTop: '1em' }}
            >
              Reclaim yours by connecting a wallet and selecting up to 40 words
              that you will make your own.
            </p> */}
            <p
              className={clsx(styles.subtitle, 'fluid-type')}
              style={{ marginTop: '1em' }}
            >
              The Declaration of Independence marked America’s exit from the
              British Empire. By minting bits of the old declaration and
              committing Re-declarations to the blockchain, we’re departing
              again, taking ownership of the founding document, breaking from
              today’s America and redefining the nation as ours. All of us. Join
              us.
            </p>
          </header>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              className={clsx(
                styles.button,
                walletAddress && styles.buttonWalletConnected
              )}
              onClick={connectWalletAndStoreAddress}
            >
              {walletAddress ? `Connected: ${walletAddress}` : 'Connect wallet'}
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setSelection({})
                setTextSelKey(textSelKey + 1)
              }}
              disabled={selection === null || selection?.text === '' || loading}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              margin: '3rem 0 1rem',
              textTransform: 'uppercase',
              color: '#888',
              fontSize: '0.8rem',
            }}
          >
            ↓ click to start and end a selection
          </div>

          <TextSelector
            key={textSelKey}
            text={declarationText}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={styles.declaration}>
        <Declaration size='500px' compact address={walletAddress}>
          {selection?.text}
        </Declaration>

        {walletAddress && selection && selection?.text !== '' && (
          <button
            className={clsx(styles.button, styles.mintButton)}
            onClick={generateAndMint}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Mint'}
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <a
            href='https://twitter.com/RdclrtnsNFT'
            className={styles.link}
            target='_blank'
            rel='noreferrer'
          >
            Follow the project on Twitter
          </a>
          <a
            href='https://discord.gg/m5Q3bbYeGT'
            className={styles.link}
            target='_blank'
            rel='noreferrer'
          >
            Join us on Discord
          </a>
        </div>
      </div>
    </div>
  )
}

export default Mint
