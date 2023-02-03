<script lang="ts">
	import { Check, Cross2, DragHandleDots2, Plus } from 'radix-icons-svelte';
	import TaskComponent from '$lib/components/Task.svelte';
	import type { CardCrud, CardWithTasks, TaskCrud } from '../../routes/+page.svelte';
	import type { Task } from '@prisma/client';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// Constants
	const defaultNewTaskForm = {
		title: ''
	};
	const defaultCardTitleForm = {
		title: ''
	};

	// Card Props
	export const createdAt: Date = new Date();
	export const order: number = 0;
	export let id: string;
	export let title: string;
	export let tasks: Task[];

	// CRUD Props
	export let cardCrud: CardCrud;
	export let taskCrud: TaskCrud;

	// State
	let isEditingTitle = false;
	let isDeleting = false;
	let cardIsMounting = true;
	let newTaskForm = { ...defaultNewTaskForm };
	let cardTitleForm = { ...defaultCardTitleForm };

	// Functions
	const toggleCompleted = async (card_id: string, task_id: string, completed: boolean) => {
		await taskCrud.edit({
			action: 'toggle_completed',
			context: { card_id, task_id, completed }
		});
	};
	const toggleIsEditingTitle = () => {
		newTaskForm = { ...defaultNewTaskForm };
		isEditingTitle = !isEditingTitle;
	};

	const addTask = (e: Event) => {
		e.preventDefault();
		// create
		taskCrud.create(id, newTaskForm.title);

		// reset
		newTaskForm = { ...defaultNewTaskForm };
	};

	const renameCard = (e: Event) => {
		e.preventDefault();
		// create
		cardCrud.edit({
			action: 'edit_title',
			context: { card_id: id, new_card_title: cardTitleForm.title }
		});

		// reset
		cardTitleForm = { ...defaultCardTitleForm };
		toggleIsEditingTitle();
	};

	const deleteCard = async () => {
		isDeleting = true;
		await cardCrud.delete(id);
		isDeleting = false;
	};
</script>

<div
	transition:fade={{ delay: 0, duration: 100 }}
	class={`flex h-min flex-col gap-4 bg-bleu-gray px-3 pt-2 pb-4 rounded-md max-w-[15rem] min-w-[12.5rem] justify-start text-center drop-shadow-md ${
		cardIsMounting ? 'opacity-100' : 'opacity-100'
	} transition-all ease-in-out duration-100`}
>
	{#if isEditingTitle}
		<form class="flex mt-auto w-full justify-center items-center gap-3 my-1" on:submit={renameCard}>
			<button
				type="button"
				on:click={toggleIsEditingTitle}
				class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent text-red-400 hover:text-red-700 transition-all duration-100 ease-in-out"
				><Cross2 /></button
			>
			<input
				bind:value={cardTitleForm.title}
				placeholder={title}
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
		<button class="absolute left-2 p-1 text-bleu-bg">
			<DragHandleDots2 class="h-4 w-4" />
		</button>
		<h1
			on:click={toggleIsEditingTitle}
			on:keydown={toggleIsEditingTitle}
			class="select-none mx-auto px-4 cursor-pointer text-2xl font-medium hover:text-neutral-600 transition-all duration-100 ease-in-out"
		>
			{title}
		</h1>
	{/if}
	{#each tasks as task (task.id)}
		<TaskComponent {...{ taskCrud, card_id: id, toggleCompleted, task }} />
	{/each}
	<form class="flex mt-auto w-full justify-center items-center gap-2 px-1" on:submit={addTask}>
		<input
			bind:value={newTaskForm.title}
			placeholder="Add Task"
			type="text"
			class="box-border w-full text-lg pl-2 bg-transparent border-b border-bleu-primary"
		/>
		<button
			class="h-min p-1 rounded-full disabled:text-neutral-400 disabled:hover:bg-transparent hover:text-bleu-primary hover:bg-bleu-dark transition-all duration-100 ease-in-out"
			disabled={newTaskForm.title.length <= 0}><Plus /></button
		>
	</form>
	<button
		on:click={deleteCard}
		disabled={isDeleting}
		class="bg-transparent border-red-400 border self-center px-4 rounded-sm hover:bg-red-400 transition-all duration-100 ease-in-out"
		>Delete</button
	>
</div>
