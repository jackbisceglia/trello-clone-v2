<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
</script>

<div class="flex flex-col h-screen">
	<Navbar />
	<div class="px-8 sm:px-20 py-10 mb-auto h-max flex-1">
		<slot />
	</div>
</div>
