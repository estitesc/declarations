import React from 'react'
import styles from '../styles/Declaration.module.css'
import { Textfit } from 'react-textfit'
import seedrandom from 'seedrandom'
import { Logo } from './Logo'
import clsx from 'clsx'

const defaultText =
  'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.'

const address = '0x0614c8D023e530AE260b3dFE5CD15BD2897D944d'

const colorPalette = [
  '#F59F00',
  '#9180F4',
  '#529642',
  '#E67700',
  '#9180F4',
  '#3F6695',
  '#EB53C7',
  '#529642',
  '#C79A4B',
]

const rand = (max: any) => {
  return Math.floor(Math.random() * max)
}

type RectProps = {
  fill: string
}

const Rect: React.FC<RectProps> = ({ fill, ...props }) => {
  return (
    <rect
      x={rand(120 + 20)}
      y={rand(120 + 20)}
      width={rand(100 + 20)}
      height={rand(100 + 20)}
      rx={rand(10)}
      filter={rand(1) < 0.8 ? 'url(#blur)' : undefined}
      className={styles.backgroundRect}
      fill={fill}
      {...props}
    ></rect>
  )
}

const chunkString = (str: string, len: number) => {
  const size = Math.ceil(str.length / len)
  const r = Array(size)
  let offset = 0

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len)
    offset += len
  }

  return r
}

const getColorsFromAddress = (address: string) => {
  return chunkString(address.replace('0x', 'ff'), 6).map((hex) => `#${hex}`)
}

type BackgroundProps = {
  seed?: string
  className?: string
  address?: string
}

export const Background: React.FC<BackgroundProps> = ({
  seed,
  className,
  address,
  ...rest
}) => {
  seedrandom(seed, { global: true })
  const colors = address ? getColorsFromAddress(address) : colorPalette
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 200 200'
      className={className}
      style={{
        position: 'absolute',
        inset: '0',
        mixBlendMode: 'hard-light',
      }}
      id='declaration-background'
      {...rest}
    >
      <filter id='blur'>
        <feTurbulence
          baseFrequency='0.08'
          numOctaves={rand(5) + 1}
          result='wrap'
          type='fractalNoise'
        />

        <feDisplacementMap
          in='SourceGraphic'
          in2='wrap'
          scale={rand(50) + 5}
          xChannelSelector='R'
          yChannelSelector='B'
        />

        <feConvolveMatrix kernelMatrix='1 5 -1 -1 0 4 0 0 -1' />
      </filter>

      {Array.from(Array(rand(20) + 5)).map((num, i) => (
        <Rect fill={colors[rand(colors.length)]} key={`${Date.now()} ${i}`} />
      ))}
    </svg>
  )
}

interface DeclarationProps {
  children?: string
  size?: string
  address?: string
  compact?: boolean
  background?: string
}

const Declaration: React.FC<DeclarationProps> = ({
  children,
  address,
  size,
  compact = false,
  background,
}) => {
  return (
    <div
      className={clsx(styles.canvas, compact && 'compact')}
      style={{
        height: size,
        width: size,
        ...(compact ? { padding: '2rem' } : {}),
      }}
    >
      <Textfit
        key={children?.toString()}
        mode='multi'
        className={styles.text}
        max={compact ? 100 : 200}
        style={{ paddingBottom: compact ? '1.5rem' : '4rem' }}
      >
        {children}
      </Textfit>

      <div>
        <Logo
          style={{
            filter: 'invert()',
            opacity: '0.8',
            width: '50%',
            maxWidth: 'none',
            margin: '0',
          }}
        />
      </div>

      {children && (
        <Background seed={children.toString().trim()} address={address} />
      )}

      {/* {background && <div dangerouslySetInnerHTML={{ __html: background }} />}

      {children && !background && (
        <div>
          <Background seed={children.toString().trim()} address={address} />
        </div>
      )} */}
    </div>
  )
}

export default Declaration
