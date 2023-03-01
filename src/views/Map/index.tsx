import { RouteComponentProps, useParams } from '@reach/router'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../..'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Header } from './Header'
import { IFrame } from './styles'

const SHARE_URL_BASE = 'https://maps-public.mapeo.world/groups'

export const MapView = ({}: RouteComponentProps) => {
  const [user] = useAuthState(auth)
  const params = useParams()

  const id = params.id as string

  const iframeSrc = user && id ? `${SHARE_URL_BASE}/${user.uid}/maps/${id}` : ''

  return (
    <AuthorisedLayout renderHeader={Header}>
      <IFrame src={iframeSrc} title={`User map: ${id}`} />
    </AuthorisedLayout>
  )
}
