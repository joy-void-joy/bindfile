<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'

  import { Editor } from '@tiptap/core'
  import Document from '@tiptap/extension-document'
  import Paragraph from '$lib/tiptap/Paragraph'
  import Text from '$lib/tiptap/Text'

  import Collaboration from '@tiptap/extension-collaboration'

  import type * as Y from 'yjs'
  import type { Transaction } from '@tiptap/pm/state'

  export let ydoc: Y.Doc

  let element: Element
  let editor: Editor | null = null

  type Payload = {
    editor: Editor
    transaction: Transaction
  }

  const dispatch = createEventDispatcher<{
    update: Payload
    transaction: Payload
    editorInit: Editor
  }>()

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        Document,
        Paragraph,
        Text,
        Collaboration.configure({
          document: ydoc,
        }),
      ],
      autofocus: true,
      onUpdate(data) {
        dispatch('update', data)
      },
      onTransaction(data) {
        dispatch('transaction', data)
      },
    })
    editor.setOptions()
    dispatch('editorInit', editor)
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

<div bind:this={element} />

<style global>
  :global(.tiptap) {
    display: inline-block;
    outline: none;
    white-space: pre;
    height: 90vh;
    width: 90vw;
  }
</style>
