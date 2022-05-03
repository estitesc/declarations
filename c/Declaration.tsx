import React from 'react'
import styles from '../styles/Declaration.module.css'
import { Textfit } from 'react-textfit'

const defaultText =
  'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.'

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

      <Textfit mode='single' max={40}>
        <div className={styles.byline}>
          <div className={styles.title}>redeclarations 21</div>
          <div className={styles.indices}>[23:47] [145:198] [341:482]</div>
        </div>
      </Textfit>
    </div>
  )
}

export default Declaration
