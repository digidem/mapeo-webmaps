// Unzips a File and returns an array of objects containing the file data (as an

import * as JSZip from 'jszip';
import * as path from 'path';

type FilePromiseType = Promise<{
  type: 'string' | 'arraybuffer';
  data: string | ArrayBuffer;
  name: string;
  date: Date;
}>

// arraybuffer or string), filename, date
export async function unzip(zipfile: File) {
  const zip = await new JSZip().loadAsync(zipfile);
  const filePromises: FilePromiseType[] = [];
  zip.forEach((filepath, file) => {
    const filename = path.basename(filepath);
    // Ignore folders, dot files and __MACOSX files and other strange files we don't need
    if (file.dir || filepath.startsWith("__") || filename.startsWith("."))
      return;
    const type = path.extname(filepath) === ".json" ? "string" : "arraybuffer";
    filePromises.push(
      file.async(type).then(data => ({
        type,
        data,
        name: file.name,
        date: file.date
      }))
    );
  });
  return Promise.all(filePromises);
}