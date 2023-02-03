import adapter_auto from '@sveltejs/adapter-auto';
import adapter_vercel from '@sveltejs/adapter-vercel';
import adapter_netlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

const getAdapterByEnv = () => {
	if (process.env.VERCEL) {
		return adapter_vercel;
	} else if (process.env.NETLIFY) {
		return adapter_netlify;
	} else {
		return adapter_auto;
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: getAdapterByEnv()
	}
};

export default config;
