import { WindowLocation } from '@reach/router'
import { FieldValue } from 'firebase/firestore'

export type LocationProps = WindowLocation & {
  state: {
    from?: string
  }
}

export type MapMetadataType = {
  createdAt?: FieldValue
  description?: string
  public?: boolean
  title: string
  mapStyle?: string
  terms?: string
}
