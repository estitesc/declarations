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
  // '#826ED8',
  '#3F6695',
  // '#FFFD54',
  '#EB53C7',
  // '#CCC7DE',
  '#529642',
  '#C79A4B',
]

const rand = (max) => {
  return Math.floor(Math.random() * max)
}

const Rect = (props) => {
  return (
    <rect
      x={rand(120 + 20)}
      y={rand(120 + 20)}
      width={rand(100 + 20)}
      height={rand(100 + 20)}
      rx={rand(10)}
      filter={Math.random() < 0.8 ? 'url(#blur)' : undefined}
      // filter='url(#blur)'
      // opacity={`0.${rand(9)}${rand(10)}`}
      // fill={colorPalette[rand(colorPalette.length)]}
      className={styles.backgroundRect}
      {...props}
    ></rect>
  )
}

const Globe = ({}) => {
  const color = colorPalette[rand(colorPalette.length)]
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 600 600'
      className={styles.globe}
    >
      <g fill={color}>
        <circle cx='300' cy='100' r='5'></circle>
        <circle cx='381.347' cy='117.291' r='5'></circle>
        <circle cx='448.629' cy='166.174' r='5'></circle>
        <circle cx='490.211' cy='238.197' r='5'></circle>
        <circle cx='498.904' cy='320.906' r='5'></circle>
        <circle cx='473.205' cy='400' r='5'></circle>
        <circle cx='417.557' cy='461.803' r='5'></circle>
        <circle cx='341.582' cy='495.63' r='5'></circle>
        <circle cx='258.418' cy='495.63' r='5'></circle>
        <circle cx='182.443' cy='461.803' r='5'></circle>
        <circle cx='126.795' cy='400' r='5'></circle>
        <circle cx='101.096' cy='320.906' r='5'></circle>
        <circle cx='109.789' cy='238.197' r='5'></circle>
        <circle cx='151.371' cy='166.174' r='5'></circle>
        <circle cx='218.653' cy='117.291' r='5'></circle>
      </g>
      <path
        stroke={color}
        strokeWidth='1'
        d='M300 100l81.347 17.291M300 100l148.629 66.174M300 100l190.211 138.197M300 100l198.904 220.906M300 100l173.205 300M300 100l117.557 361.803M300 100l41.582 395.63M300 100l-41.582 395.63M300 100L182.443 461.803M300 100L126.795 400M300 100L101.096 320.906M300 100L109.789 238.197M300 100l-148.629 66.174M300 100l-81.347 17.291m162.694 0l67.282 48.883m-67.282-48.883l108.864 120.906M381.347 117.291l117.557 203.615M381.347 117.291L473.205 400m-91.858-282.709l36.21 344.512m-36.21-344.512L341.582 495.63m39.765-378.339L258.418 495.63m122.929-378.339L182.443 461.803m198.904-344.512L126.795 400m254.552-282.709L101.096 320.906m280.251-203.615L109.789 238.197m271.558-120.906l-229.976 48.883m229.976-48.883H218.653m229.976 48.883l41.582 72.023m-41.582-72.023l50.275 154.732m-50.275-154.732L473.205 400m-24.576-233.826l-31.072 295.629m31.072-295.629L341.582 495.63m107.047-329.456L258.418 495.63m190.211-329.456L182.443 461.803m266.186-295.629L126.795 400m321.834-233.826L101.096 320.906m347.533-154.732l-338.84 72.023m338.84-72.023H151.371m297.258 0l-229.976-48.883m271.558 120.906l8.693 82.709m-8.693-82.709L473.205 400m17.006-161.803l-72.654 223.606m72.654-223.606L341.582 495.63m148.629-257.433L258.418 495.63m231.793-257.433L182.443 461.803m307.768-223.606L126.795 400m363.416-161.803l-389.115 82.709m389.115-82.709H109.789m380.422 0l-338.84-72.023m338.84 72.023L218.653 117.291m280.251 203.615L473.205 400m25.699-79.094l-81.347 140.897m81.347-140.897L341.582 495.63m157.322-174.724L258.418 495.63m240.486-174.724L182.443 461.803m316.461-140.897L126.795 400m372.109-79.094H101.096m397.808 0l-389.115-82.709m389.115 82.709L151.371 166.174m347.533 154.732L218.653 117.291M473.205 400l-55.648 61.803M473.205 400l-131.623 95.63M473.205 400l-214.787 95.63M473.205 400l-290.762 61.803M473.205 400h-346.41m346.41 0l-372.109-79.094M473.205 400L109.789 238.197M473.205 400L151.371 166.174M473.205 400L218.653 117.291m198.904 344.512l-75.975 33.827m75.975-33.827L258.418 495.63m159.139-33.827H182.443m235.114 0L126.795 400m290.762 61.803L101.096 320.906m316.461 140.897L109.789 238.197m307.768 223.606L151.371 166.174m266.186 295.629L218.653 117.291M341.582 495.63h-83.164m83.164 0l-159.139-33.827m159.139 33.827L126.795 400m214.787 95.63L101.096 320.906M341.582 495.63L109.789 238.197M341.582 495.63L151.371 166.174M341.582 495.63L218.653 117.291m39.765 378.339l-75.975-33.827m75.975 33.827L126.795 400m131.623 95.63L101.096 320.906M258.418 495.63L109.789 238.197M258.418 495.63L151.371 166.174M258.418 495.63l-39.765-378.339m-36.21 344.512L126.795 400m55.648 61.803l-81.347-140.897m81.347 140.897l-72.654-223.606m72.654 223.606l-31.072-295.629m31.072 295.629l36.21-344.512M126.795 400l-25.699-79.094M126.795 400l-17.006-161.803M126.795 400l24.576-233.826M126.795 400l91.858-282.709M101.096 320.906l8.693-82.709m-8.693 82.709l50.275-154.732m-50.275 154.732l117.557-203.615M109.789 238.197l41.582-72.023m-41.582 72.023l108.864-120.906m-67.282 48.883l67.282-48.883'
      ></path>
    </svg>
  )
}

const chunkString = (str, len) => {
  const size = Math.ceil(str.length/len)
  const r = Array(size)
  let offset = 0
  
  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len)
    offset += len
  }
  
  return r
}

const getColorsFromAddress = (address) => {
  return chunkString(address.replace('0x', 'ff'), 6).map(hex => `#${hex}`)
}

const Background = ({ seed }) => {
  // seedrandom(seed, { global: true });
  const colors = getColorsFromAddress(address)
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
      className={styles.background}
    >
      <filter id='blur'>
        {/* <feTurbulence
          type='turbulence'
          baseFrequency='0.01'
          numOctaves='0.1'
          result='turbulence'
          stitchTiles='stitch'
          seed={rand(1000)}
        />
        <feDisplacementMap
          in2='turbulence'
          in='SourceGraphic'
          scale='20'
          xChannelSelector='R'
          yChannelSelector='G'
        /> */}

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

        {/* <feGaussianBlur stdDeviation={rand(8) + 2} /> */}
      </filter>

      {Array.from(Array(rand(25) + 5)).map((i) => (
        <Rect fill={colors[rand(colors.length)]} key={i} />
      ))}
    </svg>
  )
}

interface DeclarationProps {
  children: React.Node
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

      <Background seed={children} />
      {/* <Globe /> */}
    </div>
  )
}

export default Declaration
