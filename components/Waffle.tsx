import React, { useState } from 'react'
import Cell from './Cell'

const MIN = 3
const MAX = 6
const TRAP_RATE = 0.3

let step = MAX - MIN
let colCnt = 2 * step + 1
let cellCnt = Array.from(
  { length: colCnt },
  (col, colIdx) => MAX - Math.abs(step - colIdx)
)

class Coordinate {
  colIdx: number
  cellIdx: number
  cellPos: number
  valid: boolean

  constructor(colIdx: number, cell: number, mode: 'idx' | 'pos') {
    if (mode === 'idx') {
      this.cellIdx = cell
      this.cellPos = Math.abs(step - colIdx) + 2 * cell
    } else {
      this.cellPos = cell
      this.cellIdx = ((cell - Math.abs(step - colIdx)) / 2) | 0
    }
    this.colIdx = colIdx
    this.valid = this.cellIdx >= 0 && this.cellIdx < cellCnt[colIdx]
  }
}

const adjRelPos = [
  { colIdx: -1, cellPos: -1 },
  { colIdx: -1, cellPos: 1 },
  { colIdx: 0, cellPos: -2 },
  { colIdx: 0, cellPos: 2 },
  { colIdx: 1, cellPos: -1 },
  { colIdx: 1, cellPos: 1 },
]
function adjCells(colIdx: number, cellIdx: number): Coordinate[] {
  let cell = new Coordinate(colIdx, cellIdx, 'idx')
  let result = Array<Coordinate>()
  adjRelPos.forEach((relPos) => {
    let adjCell = new Coordinate(
      cell.colIdx + relPos.colIdx,
      cell.cellPos + relPos.cellPos,
      'pos'
    )
    if (adjCell.valid) result.push(adjCell)
  })
  return result
}

type WaffleState = 'start' | 'play' | 'end'

interface WaffleProps {
  setBoxState: Function
}

export default function Waffle({ setBoxState }: WaffleProps) {
  const [state, setState] = useState<WaffleState>('start')
  const [waffleArr, setWaffleArr] = useState(Array<Array<number>>())
  const [nonTrapCnt, setNonTrapCnt] = useState(0)
  const [openCnt, setOpenCnt] = useState(0)

  function start() {
    let waffleArr = Array.from({ length: colCnt }, (col, colIdx) =>
      Array.from(
        { length: cellCnt[colIdx] },
        (cell) => -Number(Math.random() < TRAP_RATE)
      )
    )
    let nonTrapCnt = 0
    waffleArr.forEach((colVal, colIdx) =>
      colVal.forEach((cellVal, cellIdx) => {
        if (cellVal === -1) {
          adjCells(colIdx, cellIdx).forEach((adjCell) => {
            if (waffleArr[adjCell.colIdx][adjCell.cellIdx] !== -1) {
              waffleArr[adjCell.colIdx][adjCell.cellIdx]++
            }
          })
        } else {
          nonTrapCnt++
        }
      })
    )
    setWaffleArr(waffleArr)
    setNonTrapCnt(nonTrapCnt)
    setState('play')
  }

  function handleCellClick(cellVal: number) {
    if (state !== 'play') return false
    if (cellVal === -1) {
      setState('end')
      setBoxState('lose')
      return true
    }
    setOpenCnt(openCnt + 1)
    if (openCnt + 1 === nonTrapCnt) {
      setState('end')
      setBoxState('win')
    }
    return true
  }

  if (state === 'start') start()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {waffleArr.map((colVal, colIdx) => (
        <div
          key={`${colIdx}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.33rem',
          }}
        >
          {colVal.map((cellVal, cellIdx) => (
            <Cell key={`${colIdx}-${cellIdx}`} onCellClick={handleCellClick}>
              {cellVal}
            </Cell>
          ))}
        </div>
      ))}
    </div>
  )
}
