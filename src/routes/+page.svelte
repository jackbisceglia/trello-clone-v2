<script context="module" lang="ts">
	export type CardWithTasks = Card & {
		tasks: Task[];
	};

	type GenericEditOptions<T, K> = {
		action: T;
		context: K;
	};
	export type EditTaskOptions =
		| GenericEditOptions<
				'toggle_completed',
				{ card_id: string; task_id: string; completed: boolean }
		  >
		| GenericEditOptions<
				'edit_title',
				{ card_id: string; task_id: string; new_task_title: string }
		  >;

	export type EditCardOptions = GenericEditOptions<
		'edit_title',
		{ card_id: string; new_card_title: string }
	>;

	type GenericReducerAction<T, K> = {
		type: T;
		payload: K;
	};

	type CardActions =
		| GenericReducerAction<'prepend', { new_card: CardWithTasks }>
		| GenericReducerAction<'replace', { new_card: CardWithTasks }>
		| GenericReducerAction<'reload', { cards: CardWithTasks[] }>
		| GenericReducerAction<'delete', { card_id: string }>;

	export type CardCrud = {
		create: (title?: string) => Promise<void>;
		read: () => Promise<void>;
		edit: (options: EditCardOptions) => Promise<void>;
		delete: (card_id: string) => Promise<void>;
		fetching: boolean;
	};
	export type TaskCrud = {
		create: (card_id: string, title: string) => Promise<void>;
		edit: (options: EditTaskOptions) => Promise<void>;
		delete: (card_id: string, task_id: string) => Promise<void>;
	};
</script>

<script lang="ts">
	import CardComponent from '$lib/components/Card.svelte';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import { Plus } from 'radix-icons-svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Card, Task } from '@prisma/client';
	// helpers
	const cards_reducer = (state: CardWithTasks[], action: CardActions) => {
		switch (action.type) {
			case 'reload':
				return action.payload.cards;
			case 'prepend':
				return [action.payload.new_card, ...state];
			case 'replace':
				return state.map((card) => {
					if (card.id === action.payload.new_card.id) {
						return action.payload.new_card;
					}
					return card;
				});
			case 'delete':
				return state.filter((card) => card.id !== action.payload.card_id);
			default:
				return state;
		}
	};

	// Page State
	let cards: CardWithTasks[] = [];
	let creatingCard = false;

	// CRUD
	const cardCrud: CardCrud = {
		fetching: false,
		read: async function () {
			this.fetching = true;
			const res = await trpc($page).cards.getCardsById.query();

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'reload',
				payload: { cards: res }
			});
			this.fetching = false;
		},
		create: async function (title = 'Untitled') {
			creatingCard = true;

			const res = await trpc($page).cards.createCard.mutate({
				title,
				order: Math.max(...cards.map((c) => c.order), -1) + 1
			});

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'prepend',
				payload: { new_card: res }
			});
			creatingCard = false;
		},
		edit: async function (options: EditCardOptions) {
			let res;
			if (options.action === 'edit_title') {
				res = await trpc($page).cards.editCardTitle.mutate(options.context);
			}

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		},
		delete: async function (card_id: string) {
			const res = await trpc($page).cards.deleteCard.mutate({ card_id });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'delete',
				payload: { card_id: res.id }
			});
		}
	};

	const taskCrud: TaskCrud = {
		create: async (card_id: string, title: string) => {
			const res = await trpc($page).tasks.createTask.mutate({ card_id, title });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		},
		edit: async (options: EditTaskOptions) => {
			let res = undefined;
			if (options.action === 'toggle_completed') {
				res = await trpc($page).tasks.editTaskCompleted.mutate(options.context);
			} else if (options.action === 'edit_title') {
				res = await trpc($page).tasks.editTaskTitle.mutate(options.context);
			}

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		},
		delete: async (card_id: string, task_id: string) => {
			const res = await trpc($page).tasks.deleteTask.mutate({ card_id, task_id });

			if (!res) return;

			cards = cards_reducer(cards, {
				type: 'replace',
				payload: { new_card: res }
			});
		}
	};
</script>

<main class="w-full flex gap-8 flex-wrap justify-center sm:justify-start">
	{#await cardCrud.read()}
		<Spinner />
	{:then}
		{#if creatingCard}
			<div class="w-[15rem] ">
				<Spinner />
			</div>
		{/if}
		{#if cards.length > 0}
			{#each cards as card (card.id)}
				<CardComponent {...{ ...card, taskCrud, cardCrud }} />
			{/each}
		{:else}
			<div class="flex flex-col items-center sm:items-start w-full h-full">
				<h1 class="text-5xl font-semibold text-neutral-200 text-center py-2">No cards yet</h1>
				<p class="text-center text-bleu-primary text-lg">Click the button below to create a card</p>
			</div>
		{/if}
	{/await}
	<button
		on:click={() => cardCrud.create()}
		disabled={creatingCard}
		class="absolute bottom-20 left-20 disabled:bg-neutral-500 text-4xl bg-bleu-primary h-min p-4 rounded-full my-4 hover:bg-[#3ecfff] transition-all duration-100 ease-in-out"
		><Plus class="h-5 w-5" /></button
	>
</main>
