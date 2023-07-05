import type { PageServerLoad } from './$types'

import { userfiles } from '$lib/server/config'
import { treedir } from '$lib/server/treedir'

export const load = (async () => {
  return {
    listFiles: await treedir(userfiles, { relativeTo: userfiles }),
  }
}) satisfies PageServerLoad
