import express from 'express'
import expressWebsockets from 'express-ws'

import { handler as serverHandler } from '../../build/handler.js'
import { createHocuspocusExpressWrapper } from './plugins/hocuspocus_prod.js'

const wsInstance = expressWebsockets(express())
const hocusPocus = createHocuspocusExpressWrapper(wsInstance)

wsInstance.app.use(serverHandler)

async function listen() {
  await import('dotenv/config')

  const listener = wsInstance.app.listen(
    Number(process.env.PORT),
    process.env.HOST,
    // eslint-disable-next-line no-console
    () => console.log('Listening to ', listener.address()),
  )
}

await listen()
