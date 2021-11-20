<script context="module" lang="ts">
export async function load({fetch})
{
    const response = await fetch(`api/listfiles`);
    const files = (await response.json())['files'];

    return {
        props: {
            files,
        },
    }
}
</script>

<script lang="ts">
    export let files = [];
</script>

<ul>
{#each files as f}
    <li><a href="{f}">{f}</a></li>
{/each}
</ul>
