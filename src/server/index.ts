import express from 'express'
import expressWebsockets from 'express-ws'
import 'dotenv/config'

import { handler as serverHandler } from '../../build/handler.js'
import { createHocuspocusExpressWrapper } from './plugins/hocuspocus_prod.js'

const wsInstance = expressWebsockets(express())
const hocusPocus = createHocuspocusExpressWrapper(wsInstance)

wsInstance.app.use(serverHandler)

const listener = wsInstance.app.listen(
  Number(process.env.SECRET_PORT),
  process.env.SECRET_HOST,
  // eslint-disable-next-line no-console
  () => console.log('Listening to ', listener.address()),
)
