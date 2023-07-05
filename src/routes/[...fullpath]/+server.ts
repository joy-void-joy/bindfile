import type { RequestHandler } from './$types'

import { addListener, removeListener, type ID } from '$lib/server/sse'

export const GET = (() => {
  const { id, listener } = addListener()

  const stream = new ReadableStream({
    /* Can hardly wait for tc39/proposal-string-dedent */
    start(controller) {
      controller.enqueue(`
event: initialize
data: ${JSON.stringify({ id })}

      `)

      listener.on('refresh', (sender: ID) => {
        controller.enqueue(`
event: refresh
data: ${JSON.stringify({ sender })}

        `)
      })
    },

    cancel() {
      removeListener(id)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}) satisfies RequestHandler
