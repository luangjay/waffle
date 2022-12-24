import { Button, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import Waffle from './Waffle'

type BoxState = 'play' | 'lose' | 'win'

export default function Box() {
  const [state, setState] = useState<BoxState>('play')

  function handlePlay() {
    setState('play')
  }

  async function setBoxState(state: BoxState) {
    if (state === 'lose') {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
      setState('lose')
      alert('เขียนโค้ดได้สักทีโว้ยยย')
    }
    if (state === 'win') {
      setState('win')
    }
  }

  if (state === 'lose') {
    return (
      <>
        <Text>YOU LOSE</Text>
        <Button light color='primary' onPress={handlePlay}>
          Try again
        </Button>
      </>
    )
  }
  if (state === 'win') {
    return (
      <>
        <Text>YOU WIN</Text>
        <Button light color='primary' onPress={handlePlay}>
          Play again
        </Button>
      </>
    )
  }
  return (
    <>
      <Waffle setBoxState={setBoxState} />
    </>
  )
}
