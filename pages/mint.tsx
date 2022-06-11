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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <header className={styles.header}>
            <Logo className={styles.logo} />
            <p className={styles.subtitle + ' fluid-type'}>
              A reclaiming of the Declaration of Independence by those who never
              signed it.
            </p>
          </header>

          <button onClick={connectWalletAndStoreAddress}>connect wallet</button>
          <button
            onClick={() => {
              setSelection({})
              setTextSelKey(textSelKey + 1)
            }}
            disabled={selection === null || selection?.text === ''}
          >
            Reset
          </button>

          <TextSelector
            key={textSelKey}
            text={declarationText}
            onChange={onChange}
          />
        </div>
      </div>
      <Declaration size='500px' compact address={walletAddress}>
        {selection?.text}
      </Declaration>
    </div>
  )
}

export default Mint
