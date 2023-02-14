import { useCallback } from 'react'
import { DropzoneInputProps, DropzoneRootProps, useDropzone } from 'react-dropzone'
import { unzip } from '../helpers/file'
import { useCreateMap } from './useCreateMap'

export function useDropzoneMaps() {
  const { createMap } = useCreateMap()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/))
      return console.log('invalid file', acceptedFiles[0])
    console.log('HERERE')
    const unzippedFiles = await unzip(acceptedFiles[0])
    console.log({ unzippedFiles })
    const data = createMap(unzippedFiles)
  }, [])

  return useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: ['.mapeomap'],
    onDrop,
  })
}
