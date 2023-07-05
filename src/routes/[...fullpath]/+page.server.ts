import type { PageServerLoad } from './$types'
import type { Actions } from './$types'

import fs from 'node:fs/promises'
import path from 'node:path'

import { error, fail } from '@sveltejs/kit'
import { userfiles } from '$lib/server/config'
import { broadcast } from '$lib/server/sse'

const pwd = path.resolve('.')

const checkPath = (fullpath: string) => {
  const resolvedPath = path.relative(pwd, path.resolve(userfiles, fullpath))

  if (!resolvedPath.startsWith('userfiles')) {
    throw new Error('Attempt to load file outside of userfiles')
  }

  return resolvedPath
}

export const load = (async ({ params, depends }) => {
  depends('fileContent')

  const resolvedPath = checkPath(params.fullpath)
  await fs
    .mkdir(path.dirname(resolvedPath), { recursive: true })
    .catch((e: Error) => {
      throw error(400, e.message)
    })

  return {
    content: (await fs.readFile(resolvedPath, { flag: 'a+' })).toString(),
  }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, params }) => {
    const data = await request.formData()

    const id = data.get('id')
    const content = data.get('content') || ''
    if (!id) {
      return fail(400, { id, missing: true })
    }

    await fs.writeFile(userfiles + '/' + params.fullpath, content as string)
    broadcast(id as string)
  },
} satisfies Actions
