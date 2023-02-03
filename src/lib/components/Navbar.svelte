<script>
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	const unprotectedPaths = ['/signin'];

	const showAuthedOptions = $page.route.id && !unprotectedPaths.includes($page.route.id);
</script>

{#if showAuthedOptions}
	<nav class="flex gap-3 justify-between w-full px-8 sm:px-20 py-4 bg-bleu-primary">
		<a href="/">
			<h1 class="text-bleu-dark text-xl sm:text-2xl font-bold">Trello-CloneV2</h1>
		</a>
		<div class="flex gap-2">
			<button
				on:click={signOut}
				class="text-sm border-[1px] border-bleu-dark sm:border-2 px-4 rounded-md sm:text-lg self-stretch hover:bg-bleu-dark hover:text-bleu-primary transition-all ease-in-out duration-150"
				>Sign Out</button
			>
			<!-- <a
				href="/me"
				class="border-bleu-dark border-2 px-4 rounded-md text-lg self-stretch hover:bg-bleu-dark hover:text-bleu-primary transition-all ease-in-out duration-150"
				>My Account</a
			> -->
		</div>
	</nav>
{/if}
