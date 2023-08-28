import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  return {
    fullPath: params.fullPath,
  }
}
