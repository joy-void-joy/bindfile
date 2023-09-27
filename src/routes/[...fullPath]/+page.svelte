<script lang="ts">
  import { shortcut } from '$lib/actions/shortcut'
  import { interval } from '$lib/actions/interval'
  import { onMount } from 'svelte'

  import Fa from 'svelte-fa'
  import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'

  import Tiptap from '../Tiptap.svelte'

  import { PUBLIC_ROOT_PATH } from '$env/static/public'

  import { PUBLIC_USE_PERSISTENCE } from '$env/static/public'

  import type { HocuspocusProvider } from '@hocuspocus/provider'
  import type { IndexeddbPersistence } from 'y-indexeddb'
  import type * as Y from 'yjs'
  import type { PageData } from './$types'

  export let data: PageData

  let hocuspocusProvider: HocuspocusProvider | null = null
  let persistenceProvider: IndexeddbPersistence | null = null
  let ydoc: Y.Doc

  let spin = true

  onMount(async () => {
    /* Editor */
    const { HocuspocusProvider } = await import('@hocuspocus/provider')
    const { IndexeddbPersistence } = await import('y-indexeddb')
    const Y = await import('yjs')

    ydoc = new Y.Doc()

    hocuspocusProvider = new HocuspocusProvider({
      url: PUBLIC_ROOT_PATH ? ("wss://" + PUBLIC_ROOT_PATH.replace(/^https?\:\/\//i, "")) : location.origin.replace(/^http/, 'ws'),
      name: data.fullPath,
      document: ydoc,
    })

    if (PUBLIC_USE_PERSISTENCE == 'true') {
      persistenceProvider = new IndexeddbPersistence('example-document', ydoc)
    }
  })

  function resync() {
    spin = hocuspocusProvider?.hasUnsyncedChanges ?? true
  }
</script>

<svelte:window
  on:beforeunload={async (event) => {
    hocuspocusProvider?.forceSync()
    if (hocuspocusProvider?.hasUnsyncedChanges) {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }
  }}
/>

<!-- No events really worked for `resync` to receive `synced` events, so we have to poll -->
<main
  use:interval={{ delayMs: 100, callback: resync }}
  use:shortcut={{
    control: true,
    code: 'KeyS',
    callback: () => {
      hocuspocusProvider?.startSync()
      resync()
    },
  }}
>
  {#if spin}
    <Fa class="save" icon={faSpinner} spin />
  {:else}
    <Fa class="save" icon={faSave} />
  {/if}

  {#if hocuspocusProvider}
    <Tiptap {ydoc} />
  {/if}
</main>

<style lang="scss">
  :global(.save) {
    position: absolute;
    top: 0;
    right: 0.25vw;
    padding: 0;
    border: none;
    background: none;
  }
</style>
