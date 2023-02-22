// Unzips a File and returns an array of objects containing the file data (as an

import * as md5 from 'js-md5'
import * as JSZip from 'jszip'
import * as path from 'path'

export type FileType = {
  type: 'string' | 'arraybuffer'
  data: string | ArrayBuffer
  name: string
  date: Date
  hashedName?: string
}

export type ImageFileType = {
  data: ArrayBuffer
  name: string
  date: Date
  hashedName: string
}

type FilePromiseType = Promise<FileType>

// arraybuffer or string), filename, date
export const unzip = async (zipfile: File) => {
  const zip = await new JSZip().loadAsync(zipfile)
  const filePromises: FilePromiseType[] = []
  zip.forEach((filepath, file) => {
    const filename = path.basename(filepath)
    // Ignore folders, dot files and __MACOSX files and other strange files we don't need
    if (file.dir || filepath.startsWith('__') || filename.startsWith('.')) return
    const type = path.extname(filepath) === '.json' ? 'string' : 'arraybuffer'
    filePromises.push(
      file.async(type).then((data) => ({
        type,
        data,
        name: file.name,
        date: file.date,
      })),
    )
  })
  return Promise.all(filePromises)
}

export const getJsonFromFiles = (files: FileType[], filepath: string): unknown => {
  const file = files.find(({ name }) => name === filepath)
  if (file && file.type === 'string') return JSON.parse(file.data as string)
}
const VALID_EXTS = ['.png', '.jpg', '.jpeg']

export const getImagesFromFiles = (files: FileType[], validExtensions: string[] = VALID_EXTS) =>
  files
    .filter(
      ({ name }) => name.startsWith('images') && validExtensions.includes(path.extname(name).toLowerCase()),
    )
    .map((file) => {
      file.hashedName = md5(file.data) + path.extname(file.name)
      return file
    }) as ImageFileType[]
