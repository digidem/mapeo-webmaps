import { ReactNode } from 'react'

type GridStyleType = {
  backgroundColor: string
  color: string
}[]

export type SplitLayoutTypes = {
  children: [ReactNode, ReactNode] | [ReactNode]
  columns?: number
  gridStyles?: GridStyleType
  grid?: [number] | [number, number]
}
