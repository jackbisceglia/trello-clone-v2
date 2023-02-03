import { createContext } from '$lib/trpc/context';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import type { Provider } from '@auth/core/providers';
import { appRouter } from '$lib/trpc/routes/_app';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '$lib/prisma';

export const authjs: Handle = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })] as Provider[],
	pages: {
		signIn: '/signin'
	},
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				// session.user.role = user.role; <-- put other properties on the session here
			}
			return session;
		}
	},

	events: {}
});
export const trpc: Handle = createTRPCHandle({ router: appRouter, createContext });

export const handle = sequence(authjs, trpc);
