import { RouteComponentProps, useParams } from '@reach/router'
import { doc, DocumentData, DocumentSnapshot, FirestoreError, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'

import { auth, db } from '../..'
import { EditModal } from '../../components/EditModal'
import { ReplaceDataModal } from '../../components/ReplaceDataModal'
import { ShareModal } from '../../components/ShareModal'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Header } from './Header'
import { IFrame } from './styles'

const SHARE_URL_BASE = 'http://localhost:9966' // DEV URL (You'll need to run Webmaps-Public locally on port 9966)
// const SHARE_URL_BASE = 'https://maps-public.mapeo.world' // PROD URL

export const MapView = ({}: RouteComponentProps) => {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [replaceDataModalOpen, setReplaceDataModalOpen] = useState(false)
  const [user] = useAuthState(auth)
  const { id } = useParams<{ id: string }>()

  const mapUrl = user && id ? `${SHARE_URL_BASE}/groups/${user.uid}/maps/${id}` : ''
  const mapRef = doc(db, `groups/${user?.uid || ''}/maps`, id)
  const [mapData, loadingMapData] = useDocumentData(mapRef) as [
    MapData | undefined,
    boolean,
    FirestoreError | undefined,
    DocumentSnapshot<DocumentData> | undefined,
  ]

  const openReplaceDataModal = () => {
    setEditModalOpen(false)
    setReplaceDataModalOpen(true)
  }

  return (
    <>
      {!loadingMapData && (
        <>
          <ShareModal
            open={shareModalOpen}
            mapTitle={mapData?.title}
            shareUrl={mapUrl}
            onClose={() => {
              setShareModalOpen(false)
            }}
          />
          {mapData && (
            <EditModal
              open={editModalOpen}
              map={{ ...mapData, id }}
              onClose={() => {
                setEditModalOpen(false)
              }}
              onClickReplaceData={openReplaceDataModal}
            />
          )}
          {mapData && (
            <ReplaceDataModal
              open={replaceDataModalOpen}
              id={id}
              mapTitle={mapData.title}
              onClose={() => {
                setReplaceDataModalOpen(false)
              }}
            />
          )}
        </>
      )}
      <AuthorisedLayout
        title={mapData?.title}
        renderHeader={() => (
          <Header
            onClickEdit={() => {
              setEditModalOpen(true)
            }}
            onClickShare={() => {
              setShareModalOpen(true)
            }}
            mapDataLoading={loadingMapData}
          />
        )}
      >
        <IFrame src={mapUrl} title={`User map: ${id}`} />
      </AuthorisedLayout>
    </>
  )
}

export type MapData = DocumentData & {
  title: string
  id: string
  createdAt: Timestamp
  description?: string
  public?: boolean
  mapStyle?: string
  terms?: string
  accessToken?: string
}
