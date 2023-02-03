import type { Session } from '@auth/core/types';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import prisma from '../prisma';

type CreateContextOptions = {
	session: Session | null;
};

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {
		// context information
		session: await event.locals.getSession(),
		p: prisma
	};
}

// export const createContextInner = async (opts: CreateContextOptions) => {
// 	return {
// 		session: opts.session,
// 		p: prisma
// 	};
// };

// /**
//  * This is the actual context you'll use in your router
//  * @link https://trpc.io/docs/context
//  **/
// export const createContext = async (event: RequestEvent) => {
// 	// Get the session from the server using the unstable_getServerSession wrapper function
// 	const session = await event.locals.getSession();

// 	return await createContextInner({
// 		session
// 	});
// };

export type Context = inferAsyncReturnType<typeof createContext>;
