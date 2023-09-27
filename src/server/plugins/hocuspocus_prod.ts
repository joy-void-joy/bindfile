import type expressWs from 'express-ws'
import { createHocuspocusServer } from './hocuspocus'

export async function createHocuspocusExpressWrapper(server: expressWs.Instance) {
  const hocuspocus = createHocuspocusServer(server.getWss(), 'prod')

  server.app.ws('/:document', (websocket, request) => {
    hocuspocus.handleConnection(websocket, request)
  })

  return server
}
