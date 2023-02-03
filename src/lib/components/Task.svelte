<script lang="ts">
	import type { Task } from '@prisma/client';
	import { Check, Checkbox, CheckCircled, Cross1, Cross2, Pencil1 } from 'radix-icons-svelte';
	import type { TaskCrud } from '../../routes/+page.svelte';
	const defaultTaskTitleForm = {
		title: ''
	};

	export let card_id: string;
	export let task: Task;
	export let taskCrud: TaskCrud;
	export let toggleCompleted: (card_id: string, task_id: string, completed: boolean) => void;

	let isEditingTaskTitle = false;

	const toggleIsEditingTaskTitle = () => {
		taskTitleForm = { ...defaultTaskTitleForm };
		isEditingTaskTitle = !isEditingTaskTitle;
	};

	const renameTask = (e: Event) => {
		e.preventDefault();
		// create
		taskCrud.edit({
			action: 'edit_title',
			context: { card_id: card_id, task_id: task.id, new_task_title: taskTitleForm.title }
		});

		// reset
		taskTitleForm = { ...defaultTaskTitleForm };
		toggleIsEditingTaskTitle();
	};

	let taskTitleForm = { ...defaultTaskTitleForm };
</script>

<div
	class="flex justify-between w-full bg-neutral-50 px-4 text-lg rounded-md drop-shadow-sm font-medium"
>
	{#if isEditingTaskTitle}
		<form class="flex mt-auto w-full justify-end items-between gap-1 py-2" on:submit={renameTask}>
			<input
				bind:value={taskTitleForm.title}
				placeholder={task.title}
				type="text"
				class="box-border w-full text-lg pl-2 bg-transparent border-b border-bleu-primary"
			/>
			<div class="flex justify-center items-center">
				<button
					type="submit"
					class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent text-green-600 hover:text-green-900 transition-all duration-100 ease-in-out"
					><Check class="h-5 w-5" /></button
				>
				<button
					on:click={toggleIsEditingTaskTitle}
					class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out"
					><Cross1 /></button
				>
			</div>
		</form>
	{:else}
		<p
			class={`text-neutral-800 select-none cursor-pointer decoration-bleu-bg py-2  pr-2 decoration-2 text-left break-words max-w-[75%] text-base  ${
				task.completed && 'line-through'
			}`}
			on:click={() => toggleCompleted(card_id, task.id, task.completed)}
			on:keypress={() => toggleCompleted(card_id, task.id, task.completed)}
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
				class="text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out disabled:bg-neutral-500"
			>
				<Cross1 />
			</button>
		</div>
	{/if}
</div>
