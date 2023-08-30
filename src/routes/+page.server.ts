import type { PageServerLoad } from './$types'

import { USERFILES } from '$env/static/private'
import { treedir } from '$lib/server/treedir'

export const load = (async () => {
  return {
    listFiles: await treedir(USERFILES, {
      relativeTo: USERFILES,
      exclude: ['.sqlite'],
    }),
  }
}) satisfies PageServerLoad
