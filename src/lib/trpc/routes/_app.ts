import { router } from '../router';
import { cardRouter } from './cards';
import { taskRouter } from './tasks';

export const appRouter = router({
	cards: cardRouter,
	tasks: taskRouter
});

export type AppRouter = typeof appRouter;
