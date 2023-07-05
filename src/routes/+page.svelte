<script lang="ts">
  import type { PageData } from './$types'
  import type { Treedirent } from '$lib/server/treedir'

  import { TreeView, type ValueType } from 'svelte-tree-view'
  import RenderLeaf from './RenderLeaf.svelte'

  export let data: PageData

  const mapChildren = (v: unknown, type: ValueType): [string, unknown][] => {
    if (!v) return []

    switch (type) {
      case 'array':
        return (v as unknown[]).map((v) => ['', v])
      case 'object':
        return (v as Treedirent).children?.map((v) => ['', v])
      default:
        return [['', v]]
    }
  }
</script>

<TreeView
  data={data.listFiles}
  valueComponent={RenderLeaf}
  recursionOpts={{
    shouldExpandNode: () => true,
    omitKeys: ['name', 'path', 'isDirectory'],
    mapChildren,
  }}
  valueFormatter={() => ''}
/>
