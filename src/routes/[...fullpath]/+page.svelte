<script lang="ts">
  import type { PageData } from './$types'
  import type { ID } from '$lib/server/sse'

  import { invalidate, beforeNavigate } from '$app/navigation'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { shortcut } from '$lib/shortcut'

  import Fa from 'svelte-fa'
  import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'
  import { applyAction, enhance } from '$app/forms'

  export let data: PageData
  export let retryInterval = 500
  let id: ID

  let resend: NodeJS.Timer | null = null

  /* Event stream */
  onMount(() => {
    const sse = new EventSource($page.url)

    sse.addEventListener('initialize', ({ data }: { data: string }) => {
      const { id: init_id } = JSON.parse(data)

      id = init_id
    })

    sse.addEventListener('refresh', ({ data: { sender } }) => {
      if (sender != id) {
        invalidate('fileContent')
      }
    })

    return () => sse.close()
  })

  /* File content */
  let editor: HTMLFormElement
</script>

<svelte:window
  on:beforeunload={(event) => {
    if (resend) {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }
  }}
/>

<form
  bind:this={editor}
  method="post"
  use:enhance={() => {
    if (!resend) {
      resend = setInterval(() => editor.requestSubmit(), retryInterval)
    }

    return async ({ result, update }) => {
      if (result.type == 'error') {
        if (result.status ?? 500 < 500) {
          await applyAction(result)
          return
        }

        return editor.requestSubmit()
      }

      if (resend) {
        clearInterval(resend)
        resend = null
      }
      await update({ reset: false })
    }
  }}
>
  <button
    type="submit"
    use:shortcut={{
      control: true,
      code: 'KeyS',
    }}
    class="save"
  >
    {#if !resend}
      <Fa icon={faSave} />
    {:else}
      <Fa icon={faSpinner} spin />
    {/if}
  </button>
  <input type="text" name="id" value={id} readonly hidden />
  <!-- svelte-ignore a11y-autofocus -->
  <textarea
    name="content"
    autofocus
    value={data.content}
    on:input={() => editor.requestSubmit()}
  />
</form>

<style lang="scss">
  form button.save {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    border: none;
    background: none;
  }

  textarea {
    margin: 0;
    display: inline-block;
    font: inherit;
    outline: none;
    border: none;
    white-space: pre;
    height: 100vh;
    width: 90vw;
  }
</style>
