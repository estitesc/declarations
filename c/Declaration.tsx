import React from 'react'
import styles from '../styles/Declaration.module.css'
import { Textfit } from 'react-textfit'
import seedrandom from 'seedrandom'

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
      filter={Math.random() < 0.8 ? 'url(#blur)' : undefined}
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
      className={styles.background + ' ' + className}
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

      {Array.from(Array(rand(25) + 5)).map((i) => (
        <Rect fill={colors[rand(colors.length)]} key={i} />
      ))}
    </svg>
  )
}

interface DeclarationProps {
  children?: string
  size?: string
}

const Declaration: React.FC<DeclarationProps> = ({
  children = defaultText,
  size,
}) => {
  return (
    <div className={styles.canvas} style={{ height: size }}>
      <Textfit mode='multi' className={styles.text + ' ' + styles.dropCap}>
        {children}
      </Textfit>

      <div style={{ paddingRight: '20%' }}>
        <Textfit mode='single' max={50}>
          <div className={styles.byline}>
            <div className={styles.title}>redeclarations #21</div>
            <div className={styles.indices}>[23:47] [145:198] [341:482]</div>
          </div>
        </Textfit>
      </div>

      <Background seed={children.toString()} />
    </div>
  )
}

export default Declaration
