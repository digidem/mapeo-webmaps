import { Location } from "@reach/router"

export type firebaseConfigType = {
  projectId: string
  appId: string
  storageBucket: string
  locationId: string
  apiKey: string
  authDomain: string
  messagingSenderId: string
  measurementId: string
}

export type ChildType = React.ReactNode // Single child element

export type RouteType = {
  path: string
}

export type LocationProps = {
  state: {
    from?: string
  }
}
