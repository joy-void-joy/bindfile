import type { PageServerLoad } from './$types'

import { SECRET_USERFILES } from '$env/static/private'
import { treedir } from '$lib/server/treedir'

export const load = (async () => {
  return {
    listFiles: await treedir(SECRET_USERFILES, {
      relativeTo: SECRET_USERFILES,
      exclude: ['.sqlite'],
    }),
  }
}) satisfies PageServerLoad
