<script lang="ts">
	import { Check, Cross1, Cross2, Pencil1 } from 'radix-icons-svelte';
	import type { Task, TaskCrud } from '../../routes/+page.svelte';

	export let card_id: string;
	export let task: Task;
	export let taskCrud: TaskCrud;
	export let toggleCompleted: (card_id: string, task_id: string) => void;

	let isEditingTaskTitle = false;
	const toggleIsEditingTaskTitle = () => {
		console.log('clicked');
		isEditingTaskTitle = !isEditingTaskTitle;
	};
</script>

{#if isEditingTaskTitle}
	<form class="flex mt-auto w-full justify-center items-center gap-3 my-1">
		<button
			class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out"
			><Cross2 /></button
		>
		<input
			placeholder={task.title}
			type="text"
			class="box-border w-full text-lg pl-2 bg-transparent border-b border-bleu-primary"
		/>
		<button
			type="submit"
			class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent text-green-700 hover:text-green-900 transition-all duration-100 ease-in-out"
			><Check class="h-4 w-4" /></button
		>
	</form>
{:else}
	<p
		class={`text-neutral-800 select-none cursor-pointer decoration-bleu-bg py-2 w-max pr-2 decoration-2 ${
			task.completed && 'line-through'
		}`}
		on:click={() => toggleCompleted(card_id, task.id)}
		on:keypress={() => toggleCompleted(card_id, task.id)}
	>
		{task.title}
	</p>
	<div class="flex gap-2 font-bold">
		<button
			on:click={toggleIsEditingTaskTitle}
			class="text-neutral-800 hover:text-bleu-primary transition-all duration-100 ease-in-out"
		>
			<Pencil1 />
		</button>
		<button
			on:click={() => taskCrud.delete(card_id, task.id)}
			class="text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out"
		>
			<Cross1 />
		</button>
	</div>
{/if}
