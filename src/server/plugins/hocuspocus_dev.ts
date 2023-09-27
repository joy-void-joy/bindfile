import type { ViteDevServer } from 'vite'

import { WebSocketServer } from 'ws'
import { createHocuspocusServer } from './hocuspocus'

function createWebsocketViteWrapper(server: ViteDevServer) {
  if (!server.httpServer) {
    throw new Error('No httpServer found')
  }

  const result = new WebSocketServer({
    noServer: true,
  })

  server.httpServer.on('upgrade', (req, socket, head) => {
    /* Ignore vite-hmr requests as it conflicts with Vite's HMR's websockets
       See: https://github.com/vitejs/vite/discussions/14182#discussioncomment-6831085
    */
    if (req.headers['sec-websocket-protocol'] === 'vite-hmr') {
      return
    }

    result.handleUpgrade(req, socket, head, (ws) => {
      result.emit('connection', ws, req)
    })
  })

  return result
}

export async function configureServer(server: ViteDevServer) {
  const webSocketServer = createWebsocketViteWrapper(server)
  const hocuspocusServer = createHocuspocusServer(webSocketServer)
}

export const hocuspocus = {
  name: 'hocuspocus',
  configureServer,
}
