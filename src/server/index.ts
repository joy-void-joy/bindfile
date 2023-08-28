import express from 'express'
import expressWebsockets from 'express-ws'
import 'dotenv/config'

import { handler as serverHandler } from '../../build/handler.js'
import { createHocuspocusExpressWrapper } from './plugins/hocuspocus_prod.js'

const wsInstance = expressWebsockets(express())
const hocusPocus = createHocuspocusExpressWrapper(wsInstance)

wsInstance.app.use(serverHandler)

// eslint-disable-next-line no-console
const listener = wsInstance.app.listen(process.env.PORT || 1234, () => console.log(`Listening on port ${listener.address().port}`))
