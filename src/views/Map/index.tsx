import { RouteComponentProps, useParams } from '@reach/router'
import { doc } from 'firebase/firestore'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'

import { auth, db } from '../..'
import { ShareModal } from '../../components/ShareModal'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Header } from './Header'
import { IFrame } from './styles'

// const SHARE_URL_BASE = 'http://localhost:9966' // DEV URL (You'll need to run Webmaps-Public locally on port 9966)
const SHARE_URL_BASE = 'https://maps-public.mapeo.world' // PROD URL

export const MapView = ({}: RouteComponentProps) => {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [user] = useAuthState(auth)
  const params = useParams()

  const id = params.id as string

  const mapUrl = user && id ? `${SHARE_URL_BASE}/groups/${user.uid}/maps/${id}` : ''
  const mapRef = doc(db, `groups/${user?.uid || ''}/maps`, id)
  const [mapData, loadingMapData] = useDocumentData(mapRef)

  const openShareModal = () => {
    setShareModalOpen(true)
  }
  const closeShareModal = () => {
    setShareModalOpen(false)
  }
  const openEditModal = () => {
    setEditModalOpen(true)
  }
  const closeEditModal = () => {
    setEditModalOpen(false)
  }
  return (
    <>
      {!loadingMapData && (
        <ShareModal
          open={shareModalOpen}
          mapTitle={mapData?.title}
          shareUrl={mapUrl}
          onClose={closeShareModal}
        />
      )}
      <AuthorisedLayout
        title={mapData?.title}
        renderHeader={() => (
          <Header onClickEdit={openEditModal} onClickShare={openShareModal} mapDataLoading={loadingMapData} />
        )}
      >
        <IFrame src={mapUrl} title={`User map: ${id}`} />
      </AuthorisedLayout>
    </>
  )
}
