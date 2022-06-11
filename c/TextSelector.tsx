import * as React from 'react'
import styles from '../styles/TextSel.module.css'
import _ from 'lodash'
import clsx from 'clsx'

const blurb =
  'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.'

const MAX_SELECTIONS = 9
const SEL_COLORS = [
  '#BECBD7',
  '#D7BED0',
  '#DFA39F',
  '#F0DCA8',
  '#D8E4AA',
  '#BFCEB1',
]
const MAX_WORDS = 40

const TextSelector = ({
  text = blurb,
  onChange,
}: {
  text: string
  onChange: (data: any) => void
}) => {
  const [selections, setSelections] = React.useState([] as number[][])
  const [selIndex, setSelIndex] = React.useState(0)
  const [inProgressSelection, setInProgressSelection] = React.useState(0)

  const [selectionState, setSelectionState] = React.useState('nothing_selected')
  const words = _.split(text.trim(), ' ')

  const wordColors = React.useMemo(() => {
    let newColorMap = Array(words.length)
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      const color = SEL_COLORS[i % SEL_COLORS.length]
      for (let j = selection[0]; j <= selection[1]; j++) {
        newColorMap[j] = color
      }
    }
    return newColorMap
  }, [selections, words.length])

  const concatenated = React.useMemo(() => {
    let concat = ''

    const sortedSelections = _.sortBy(
      [...selections],
      (selection: any) => selection[0]
    )

    sortedSelections.forEach((selection: any) => {
      if (selection[0] >= 0) {
        const wordsFromSel = words.slice(selection[0], selection[1] + 1)
        concat += wordsFromSel.join(' ')
        concat += ' '
      }
    })

    return concat
  }, [selections, words])

  React.useEffect(() => {
    onChange({
      indices: selections,
      text: concatenated,
    })
  }, [concatenated, onChange, selections])

  const isInSelection = React.useCallback(
    (wordIndex: number, selIndex: number) => {
      return (
        wordIndex >= selections[selIndex][0] &&
        wordIndex <= selections[selIndex][1]
      )
    },
    [selections]
  )

  const isOverlappingInterval = React.useCallback(
    (selIndexTarget: number, interval: number[]) => {
      const startWordIndex = interval[0]
      const endWordIndex = interval[1]
      for (let i = 0; i < selections.length; i++) {
        if (i !== selIndexTarget) {
          if (
            isInSelection(startWordIndex, i) ||
            isInSelection(endWordIndex, i)
          ) {
            return true
          }
          if (
            startWordIndex < selections[i][0] &&
            endWordIndex > selections[i][1]
          ) {
            return true
          }
        }
      }
      return false
    },
    [isInSelection, selections]
  )

  const createSelection = React.useCallback(
    (startIndex: number) => {
      let newNewSels = [...selections, [startIndex, startIndex]]
      setSelections(newNewSels)
      setSelIndex(newNewSels.length - 1)
    },
    [selections]
  )

  const completeSelection = React.useCallback(
    (endIndex: number) => {
      const completedSelection = _.sortBy([selections[selIndex][0], endIndex])

      let newSelections = [...selections]
      newSelections.splice(selIndex, 1, completedSelection)
      setSelections(newSelections)
    },
    [selIndex, selections]
  )

  const isValidCompletion = React.useCallback(
    (endIndex: number) => {
      let isValid = true
      const completedSelection = _.sortBy([selections[selIndex][0], endIndex])

      if (isOverlappingInterval(selIndex, completedSelection)) {
        isValid = false
      }

      return isValid
    },
    [isOverlappingInterval, selIndex, selections]
  )

  const cancelSelection = React.useCallback(
    (selIndexTarget: number) => {
      let newSelections = [...selections]
      newSelections.splice(selIndexTarget, 1)
      setSelections(newSelections)
      setSelectionState('nothing_selected')
    },
    [selections]
  )

  const findSelection = React.useCallback(
    (wordIndex: number) => {
      for (let i = 0; i < selections.length; i++) {
        if (isInSelection(wordIndex, i)) {
          return { selIndex: i, found: true }
        }
      }
      return { selIndex: 0, found: false }
    },
    [isInSelection, selections.length]
  )

  const getWordsSelectedCount = React.useCallback(() => {
    let wordsSelected = 0
    for (let i = 0; i < selections.length; i++) {
      if (selections[i][0] >= 0) {
        wordsSelected += 1 + selections[i][1] - selections[i][0]
      }
    }
    return wordsSelected
  }, [selections])

  const onClickWord = React.useCallback(
    (wordIndex: number) => {
      if (selectionState == 'nothing_selected') {
        const inSelection = findSelection(wordIndex)
        if (inSelection.found) {
          cancelSelection(inSelection.selIndex)
          return
        }

        if (getWordsSelectedCount() > MAX_WORDS) {
          // Don't start a new selection if you already have too many words.
          return
        }

        if (selections.length >= MAX_SELECTIONS) {
          return
        }

        createSelection(wordIndex)
        setInProgressSelection(wordIndex)
        setSelectionState('first_selected')
        return
      }
      if (selectionState == 'first_selected') {
        // Don't complete selection if it would exceed max words count.
        const diff = wordIndex - selections[selIndex][0]
        if (Math.abs(diff) + getWordsSelectedCount() > MAX_WORDS) {
          return
        }

        if (isValidCompletion(wordIndex)) {
          completeSelection(wordIndex)
          setInProgressSelection(0)
          setSelectionState('nothing_selected')
        }
      }
    },
    [
      cancelSelection,
      completeSelection,
      createSelection,
      findSelection,
      getWordsSelectedCount,
      isValidCompletion,
      selIndex,
      selectionState,
      selections,
    ]
  )

  const renderWords = React.useCallback(() => {
    const wordRemaining = MAX_WORDS - getWordsSelectedCount()

    return words.map((word: string, index: number) => {
      const bgColor = wordColors[index] || 'rgba(0,0,0,0)'
      const disabled =
      selectionState === 'first_selected' &&
      inProgressSelection &&
      (index > inProgressSelection + wordRemaining ||
        index < inProgressSelection - wordRemaining)
        ? true
        : false


      return (
        <React.Fragment key={index}>
          {word.includes('\n') && (
            <>
              <br />
              <br />
            </>
          )}
          <span
            className={clsx(!disabled && styles.word)}
            onClick={() => {
              !disabled && onClickWord(index)
            }}
            style={{
              backgroundColor: bgColor,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {word.trim()}
          </span>

          <span
            className={styles.space}
            style={{
              backgroundColor: bgColor,
            }}
          >
            {' '}
          </span>
        </React.Fragment>
      )
    })
  }, [words, wordColors, onClickWord])

  return (
    <div>
      <div style={{ marginTop: 12, fontWeight: 'bold' }}>{concatenated}</div>
      <div style={{ marginTop: 12 }}>
        Words Remaining: {MAX_WORDS - getWordsSelectedCount()}
      </div>
      <div>{renderWords()}</div>
    </div>
  )
}

export default TextSelector
