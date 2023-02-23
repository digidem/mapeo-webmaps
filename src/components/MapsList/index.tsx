import { DocumentData } from 'firebase/firestore'
import { Grow, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { MapItem } from '../MapItem'

export const MapsList = ({ maps, progress: { id: currentUploadId, loading = false } }: MapsListProps) => (
  <Stack spacing={3}>
    {maps
      .filter((map) => map.id !== currentUploadId)
      .map((map) => (
        <Grow in key={map.id}>
          <span>
            <MapItem title={map.title} description={map.description} createdAt={map.createdAt} id={map.id} />
          </span>
        </Grow>
      ))}
  </Stack>
)

type MapsListProps = {
  maps: DocumentData[]
  progress: {
    id?: number
    loading?: boolean
  }
}
