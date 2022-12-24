import React, { useState } from 'react'
import { Avatar } from '@nextui-org/react'

interface CellProps {
  onCellClick: Function
  children?: number
}

export default function Cell({ onCellClick, children }: CellProps) {
  const [open, setOpen] = useState(false)
  function handleClick() {
    if (!open && onCellClick(children)) {
      setOpen(true)
    }
  }

  let text = !open || (!children && children !== 0) ? '' : children.toString()
  return <Avatar pointer text={text} onClick={handleClick} />
}
