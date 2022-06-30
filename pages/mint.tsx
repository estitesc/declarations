import React from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Mint.module.css'
import clsx from 'clsx'
import { Logo } from '../c/Logo'
import TextSelector from '../c/TextSelector'
import { declarationText } from '../utils/declarationText'
import useConnectWallet from '../h/useConnectWallet'
import Declaration from '../c/Declaration'
import useMint from '../h/useMint'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    ethereum: any
  }
}

type DeclarationPreviewProps = {
  walletAddress?: string
  selection?: any
  loading?: boolean
  onClick: () => void
  connectWalletAndStoreAddress: () => void
  setSelection: (arg0: any) => void
  setTextSelKey: (arg0: number) => void
  textSelKey: number
  mobile?: boolean
}

const DeclarationPreview = ({
  walletAddress,
  selection,
  loading,
  onClick,
  connectWalletAndStoreAddress,
  setSelection,
  setTextSelKey,
  textSelKey,
  mobile = false,
}: DeclarationPreviewProps) => {
  return (
    <>
      <Declaration size='500px' compact address={walletAddress}>
        {selection?.text}
      </Declaration>

      <div className={styles.declaration} style={{ marginTop: '1rem' }}>
        {walletAddress && (!selection || selection.text == '') && (
          <div className={clsx(styles.subtitle, 'fluid-type')}>
            Select words from the Declaration of Independence to create your
            redeclaration
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!walletAddress && (
            <button
              className={clsx(styles.button)}
              onClick={connectWalletAndStoreAddress}
            >
              Connect wallet to mint
            </button>
          )}

          {walletAddress && selection && selection?.text !== '' && (
            <button
              className={clsx(styles.button, styles.mintButton)}
              onClick={onClick}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Mint your declaration'}
            </button>
          )}

          {!(selection === null || selection?.text === '' || loading) && (
            <button
              className={styles.button}
              onClick={() => {
                setSelection({})
                setTextSelKey(textSelKey + 1)
              }}
              disabled={selection === null || selection?.text === '' || loading}
            >
              Reset selection
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {walletAddress && (
            <div className={styles.walletAddress}>
              Connected: {walletAddress}
            </div>
          )}
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
          <a
            href='https://opensea.io/collection/rdclrtns'
            className={styles.link}
            target='_blank'
            rel='noreferrer'
          >
            View on OpenSea
          </a>
        </div>
      </div>
    </>
  )
}

const Mint: NextPage = () => {
  const [selection, setSelection] = React.useState<any>({})
  const [textSelKey, setTextSelKey] = React.useState(0)
  const [walletAddress, setWalletAddress] = React.useState<string | undefined>(
    undefined
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)

  const { query } = useRouter()
  console.log('query is ', query, query.ownerId)

  const onCompleteMint = React.useCallback((result: string) => {
    if (result === 'error') {
      setError(true)
    }
  }, [])

  const { mint } = useMint(onCompleteMint, query.ownerId as string | undefined)

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
      background: declarationBackground,
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
    try {
      mint(imageUrl, selection.indices)
    } catch (err) {
      console.log('error is', err)
    }

    setLoading(false)
  }, [mint, selection.indices, selection.text, walletAddress, loading])

  return (
    <div className={clsx(styles.wrapper, loading && styles.wrapperLoading)}>
      <div className={styles.container}>
        <div>
          <header className={styles.header}>
            <Logo className={styles.logo} />
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
            <div className={styles.instructions}>
              <p style={{ marginTop: '1.5em' }}>
                Here’s how to create your own:
              </p>
              <ol style={{ marginTop: '1em' }}>
                <li>
                  <b>Select:</b> Click twice on a word to select only that word.
                  Click on a word and then another to select a range. 40 words
                  max.
                </li>
                <li>
                  <b>Get creative:</b> <i>Each redeclaration is unique!</i> So
                  get creative! View existing ones on{' '}
                  <a
                    href='https://opensea.io/collection/rdclrtns'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Opensea
                  </a>
                  . There will only ever be 568 Redeclarations.
                </li>
                <li>
                  <b>Mint:</b> When you’re happy with your selection, connect
                  your wallet to mint your redeclaration. Redeclarations are
                  free to mint + ETH gas fees.
                </li>
              </ol>
            </div>
          </header>

          <DeclarationPreview
            walletAddress={walletAddress}
            onClick={generateAndMint}
            loading={loading}
            selection={selection}
            connectWalletAndStoreAddress={connectWalletAndStoreAddress}
            setSelection={setSelection}
            setTextSelKey={setTextSelKey}
            textSelKey={textSelKey}
            mobile={true}
          />

          <div className={styles.declarationText}>
            <TextSelector
              key={textSelKey}
              text={declarationText}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.desktopOnly}
        style={{ position: 'sticky', top: '2rem' }}
      >
        <DeclarationPreview
          walletAddress={walletAddress}
          onClick={generateAndMint}
          loading={loading}
          selection={selection}
          connectWalletAndStoreAddress={connectWalletAndStoreAddress}
          setSelection={setSelection}
          setTextSelKey={setTextSelKey}
          textSelKey={textSelKey}
        />
      </div>

      {loading && (
        <div className={styles.loadingMessage}>
          <span className={styles.loader}></span>
          <div>
            Hold tight, your redeclaration is being generated. This process can
            take up to a minute or two.
          </div>
        </div>
      )}
      {error && (
        <div className={styles.loadingMessage} onClick={() => setError(false)}>
          <div>
            Someone has already minted that declaration! Try changing it up a
            bit. (click here to close)
          </div>
        </div>
      )}
    </div>
  )
}

export default Mint
