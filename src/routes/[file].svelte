<script context="module" lang="ts">
export async function load({fetch, page: {params: {file}}})
{
	const response = await fetch(`api/${file}`);
	const content = (await response.json())['content'];

	return {
		props: {
			content,
			filename: file,
		},
	}
}
</script>

<script lang="ts">
import { writable } from 'svelte/store';

export let content = '';
export let filename = '';

let current_promise = null;

function createFileContent(filename:string) {
	const { subscribe, set } = writable(content);

	return {
		subscribe,
		async set(s: string)
		{
			const sending = current_promise = fetch(`api/${filename}`, {
    			method: 'POST',
    			body: s,
  			}).then(() => { if(sending === current_promise) { current_promise = null; } } );

			set(s);
		},
	};
}
let fileContent = createFileContent(filename)

</script>

<div contenteditable bind:textContent={$fileContent} />

<style>
body html
{
    height: 100vh;
    width: 100vw;
}

div {
    display: inline-block;
	outline: none;
	white-space:pre;
	height:100vh;
	width: 90vw;
}
pre
{
    white-space: pre;
}
</style>
