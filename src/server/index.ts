import express from 'express'
import expressWebsockets from 'express-ws'

import { handler as serverHandler } from '../../build/handler.js'
import { createHocuspocusExpressWrapper } from './plugins/hocuspocus_prod.js'

import { loadEnv } from 'vite'

const wsInstance = expressWebsockets(express())
const hocusPocus = createHocuspocusExpressWrapper(wsInstance)

wsInstance.app.use(serverHandler)
process.env = { ...process.env, ...loadEnv('prod', process.cwd(), '') }

function listen() {
  const listener = wsInstance.app.listen(
    Number(process.env.PORT),
    process.env.HOST,
    // eslint-disable-next-line no-console
    () => console.log('Listening to ', listener.address()),
  )
}

listen()
