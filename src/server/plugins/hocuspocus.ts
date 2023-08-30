import { Server as HocuspocusServer } from '@hocuspocus/server'

import Document from '@tiptap/extension-document'
import Paragraph from '../../lib/tiptap/Paragraph'
import Text from '../../lib/tiptap/Text'
import { SQLite } from '@hocuspocus/extension-sqlite'
import { PersistToPlainText } from '../../lib/server/hocuspocus/PersistToPlaintext'

import type { WebSocketServer } from 'ws'

import 'dotenv/config'

const sqlitePath = `${process.env.USERFILES}/.sqlite`

export function createHocuspocusServer(wss: WebSocketServer) {
  const hocuspocusServer = HocuspocusServer.configure({
    name: 'hocuspocus',
    timeout: 30000,
    debounce: 100,
    maxDebounce: 5000,
    quiet: true,
    extensions: [
      new SQLite({ database: sqlitePath }),
      new PersistToPlainText({
        exclude: [sqlitePath],
        extensions: [Document, Paragraph, Text],
      }),
    ],
  })

  wss.on('connection', (socket, request) => {
    return hocuspocusServer.handleConnection(socket, request)
  })

  return hocuspocusServer
}
