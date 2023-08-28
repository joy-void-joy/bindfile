<script lang="ts">
  import type { TreeNode } from 'svelte-tree-view'
  import type { Treedirent } from '$lib/server/treedir'

  import Fa from 'svelte-fa'
  import { faFile, faFolderOpen, faFolderClosed } from '@fortawesome/free-solid-svg-icons'

  export let node: TreeNode<Treedirent>
</script>

{#if node.value.isDirectory}
  <Fa icon={node.collapsed ? faFolderClosed : faFolderOpen} /> {node.value.name}
{:else}
  <Fa icon={faFile} /> <a href={node.value.path}>{node.value.name}</a>
{/if}

<style lang="scss">
  /* Taken from https://github.com/picocss/pico

     MIT License
  */
  a {
    --primary: #fff;
    --primary-hover: #888;
    --primary-focus: #444;
    --primary-inverse: #000;
    --color: #000;
    --background-color: transparent;

    outline: none;
    background-color: var(--background-color);
    color: var(--color);
    transition: background-color var(--transition), color var(--transition),
      text-decoration var(--transition), box-shadow var(--transition);

    &:is([aria-current], :hover, :active, :focus) {
      --color: var(--primary-hover);
      --text-decoration: underline;
    }

    &:focus {
      --background-color: var(--primary-focus);
    }
  }
</style>
