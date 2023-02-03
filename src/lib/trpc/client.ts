import type { Router } from '$lib/trpc/router';
import superjson from 'superjson';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import type { AppRouter } from './routes/_app';

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>;

export function trpc(init?: TRPCClientInit) {
	if (typeof window === 'undefined')
		return createTRPCClient<AppRouter>({ init, transformer: superjson });
	if (!browserClient) browserClient = createTRPCClient<AppRouter>({ transformer: superjson });
	return browserClient;
}
