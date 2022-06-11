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

const Mint: NextPage = () => {
  const [selection, setSelection] = React.useState<any>({})
  const [textSelKey, setTextSelKey] = React.useState(0)
  const [walletAddress, setWalletAddress] = React.useState<string | undefined>(
    undefined
  )

  const onChange = React.useCallback((selection: any) => {
    setSelection(selection)
  }, [])

  // console.log(selection);

  const connectWallet = useConnectWallet()
  const connectWalletAndStoreAddress = React.useCallback(async () => {
    const address = await connectWallet()
    setWalletAddress(address)
  }, [connectWallet])

  return (
    <div style={{ background: 'black' }}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div>
            <header className={styles.header}>
              <Logo className={styles.logo} />
              <p
                className={clsx(styles.subtitle, 'fluid-type')}
                style={{ marginBottom: '0.75em', marginTop: '1em' }}
              >
                A reclaiming of the Declaration of Independence by those who
                never signed it.
              </p>
              <p className={clsx(styles.subtitle, 'fluid-type')}>
                Reclaim yours by connecting a wallet and selecting up to 40
                words that you will make your own.
              </p>
            </header>

            <button onClick={connectWalletAndStoreAddress}>
              connect wallet
            </button>
            <button
              onClick={() => {
                setSelection({})
                setTextSelKey(textSelKey + 1)
              }}
              disabled={selection === null || selection?.text === ''}
            >
              Reset
            </button>

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
        </div>
      </div>
    </div>
  )
}

export default Mint
