import type { Dirent } from 'node:fs'

import path from 'node:path'
import fs from 'node:fs/promises'

export type Treedirent = { name: string; path: string } & (
  | { isDirectory: true; children: Treedirent[] }
  | { isDirectory: false; children: never }
)

export type TreedirOptions = {
  relativeTo?: string
  exclude?: string[]
}

/*
  {recursive: true} does not work in node 20 with {withFileTypes: true}
  Also, this allow us to keep the folder structure data
*/
export const treedir = async (
  directory: string,
  options: TreedirOptions = {},
): Promise<Treedirent[]> => {
  // Not unpacking in function def to better pass options recursively
  const { relativeTo = null, exclude = [] } = options
  const listFiles = await fs.readdir(directory, { withFileTypes: true })

  return Promise.all(
    listFiles
      .filter((i) => !exclude.includes(i.name))
      .map(async (dirent: Dirent) => {
        const pwd = `${directory}/${dirent.name}`
        const toReturn = {
          name: dirent.name,
          path: relativeTo ? path.relative(relativeTo, pwd) : pwd,
        }

        if (dirent.isFile()) {
          return {
            ...toReturn,
            isDirectory: false,
          } as Treedirent
        } else {
          return {
            ...toReturn,
            isDirectory: true,
            children: await treedir(pwd, options),
          }
        }
      }),
  )
}
