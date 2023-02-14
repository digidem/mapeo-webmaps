// eslint-disable @typescript-eslint/no-unsafe-return
import { serverTimestamp } from 'firebase/firestore'
import { MapMetadataType } from '../types'
import { FileType, getJsonFromFiles } from './file'

export const getMetadata = (files: FileType[], id?: string) => {
  const metadata = getJsonFromFiles(files, 'metadata.json') as MapMetadataType
  metadata.title = metadata.title || 'My Map'
  metadata.public = true

  if (!id) metadata.createdAt = serverTimestamp()

  return metadata
}
