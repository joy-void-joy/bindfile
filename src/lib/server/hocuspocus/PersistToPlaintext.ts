import { generateText } from '@tiptap/core'
import { TiptapTransformer } from '@hocuspocus/transformer'

import path from 'node:path'
import fs from 'node:fs/promises'

import type * as Y from 'yjs'
import type { Extension, onLoadDocumentPayload, onStoreDocumentPayload } from '@hocuspocus/server'
import type { Extensions as TiptapExtensions } from '@tiptap/core'
import { error } from '@sveltejs/kit'

export type Configuration = {
  extensions: TiptapExtensions
  exclude?: string[]
}

const pwd = process.cwd()

export class PersistToPlainText implements Extension {
  configuration: Configuration

  constructor(configuration: Configuration) {
    this.configuration = configuration
  }

  ydocToFullText(document: Y.Doc): string | null {
    const transformed = TiptapTransformer.fromYdoc(document).default
    if (!transformed) {
      return null
    }
    return generateText(transformed, this.configuration.extensions)
  }

  async checkPath(fullpath: string): Promise<string> {
    const resolvedPath = path.relative(pwd, path.resolve(process.env.USERFILES, fullpath))

    if (
      !resolvedPath.startsWith(process.env.USERFILES) ||
      this.configuration.exclude?.includes(resolvedPath)
    ) {
      throw new Error('Attempted to access a file outside of userfiles')
    }

    await fs.mkdir(path.dirname(resolvedPath), { recursive: true }).catch((err) => {
      throw error(400, err.message)
    })

    return resolvedPath
  }

  async onLoadDocument(data: onLoadDocumentPayload) {
    // If the data has not been synced to the text file, use the text file as the ground truth.
    // TODO: Even with the check, it seems to create duplicated lines on sqlite deletion. Investigate.

    const fromFile = await fs.readFile(await this.checkPath(data.documentName), {
      flag: 'a+',
      encoding: 'utf-8',
    })
    const fromData = this.ydocToFullText(data.document)

    if (fromFile === fromData) {
      return
    }

    const schema = {
      type: 'doc',
      content: fromFile.split('\n').map((line) => ({
        type: 'paragraph',
        content: line
          ? [
              {
                type: 'text',
                text: line,
              },
            ]
          : [],
      })),
    }

    return TiptapTransformer.toYdoc(schema, 'default', this.configuration.extensions)
  }

  async onStoreDocument(data: onStoreDocumentPayload) {
    const fullText = this.ydocToFullText(data.document)
    if (fullText == null) {
      throw new Error('Malformed data')
    }

    await fs.writeFile(await this.checkPath(data.documentName), fullText)
  }
}
