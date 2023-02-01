<script lang="ts">
	import { Check, Cross1, Cross2, Pencil1, Plus } from 'radix-icons-svelte';
	import TaskComponent from '$lib/components/Task.svelte';
	import type { CardCrud, Task, TaskCrud } from '../../routes/+page.svelte';

	export let id: string;
	export let title: string;
	export let tasks: Task[];
	export let cardCrud: CardCrud;
	export let taskCrud: TaskCrud;

	let isEditingTitle = false;

	const toggleCompleted = async (card_id: string, task_id: string) => {
		await taskCrud.edit({
			action: 'toggle_completed',
			context: { card_id, task_id }
		});
	};
	const toggleIsEditingTitle = () => {
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

	const defaultNewTaskForm = {
		title: ''
	};
	let newTaskForm = { ...defaultNewTaskForm };

	const defaultCardTitleForm = {
		title: ''
	};
	let cardTitleForm = { ...defaultCardTitleForm };
</script>

<div
	class="flex h-min flex-col gap-4 bg-bleu-gray px-3 pt-2 pb-4 rounded-md max-w-[15rem] min-w-[12.5rem] justify-start text-center"
>
	{#if isEditingTitle}
		<form class="flex mt-auto w-full justify-center items-center gap-3 my-1" on:submit={renameCard}>
			<button
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
		<h1
			on:click={toggleIsEditingTitle}
			on:keydown={toggleIsEditingTitle}
			class="select-none cursor-pointer text-2xl font-medium hover:text-neutral-600 transition-all duration-100 ease-in-out"
		>
			{title}
		</h1>
	{/if}
	{#each tasks as task}
		<div
			class="flex justify-between w-full bg-neutral-50 px-4 text-lg gap-12 rounded-md shadow-sm  font-medium"
		>
			<TaskComponent {...{ taskCrud, card_id: id, toggleCompleted, task }} />
		</div>
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
		on:click={() => cardCrud.delete(id)}
		class="bg-transparent border-red-400 border self-center px-4 rounded-sm hover:bg-red-400 transition-all duration-100 ease-in-out"
		>Delete</button
	>
</div>
