<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<svelte:head>
	<title>Sign In | Trello Clone</title>
	<meta name="description" content="Sign In to get started with Trello Clone today! ✏️" />
</svelte:head>
<main class="flex-col w-full h-full flex gap-8 flex-wrap justify-center items-center">
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-5xl font-bold text-neutral-50">
			Trello-Clone <span class="text-bleu-primary">V2</span>
		</h1>
		<p class="text-xl text-bleu-primary font-light ">task tracking for your everyday needs</p>
		<form
			action=""
			class="flex flex-col mx-auto px-12 py-8 my-4 bg-neutral-50 rounded-md drop-shadow-md w-full items-center gap-4"
		>
			<h3 class="text-xl font-medium text-bleu-dark">Sign in with a provider below:</h3>
			<button
				on:click={() => signIn('github', { callbackUrl: '/' })}
				class="px-8 py-2 border-bleu-bg border-2 rounded-md font-semibold text-bleu-bg hover:bg-bleu-bg hover:text-neutral-50 transition-all duration-75 ease-in-out"
				>GitHub</button
			>
		</form>
		<p class=" text-bleu-gray/75 font-light ">more providers coming soon...</p>
	</div>
</main>
