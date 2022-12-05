
type ChildType = React.ReactElement | Element

type GridStyleType = {
  backgroundColor: string,
  color: string
}[]

export type SplitLayoutTypes = {
  children: [ChildType, ChildType] | [ChildType],
  columns?: number,
  gridStyles?: GridStyleType,
  grid?: [number] | [number, number],
}