import { router, publicProcedure } from '../router';
import { z } from 'zod';

export const taskRouter = router({
	createTask: publicProcedure
		.input(z.object({ card_id: z.string(), title: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const newCard = await ctx.p.task.create({
				data: {
					title: input.title,
					cardId: input.card_id
				},
				select: {
					card: {
						include: {
							tasks: {
								orderBy: {
									createdAt: 'asc'
								}
							}
						}
					}
				}
			});
			return newCard.card;
		}),
	editTaskTitle: publicProcedure
		.input(z.object({ card_id: z.string(), task_id: z.string(), new_task_title: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const cardWithUpdatedTask = await ctx.p.card.update({
				where: { id: input.card_id },
				data: {
					tasks: {
						update: {
							where: { id: input.task_id },
							data: {
								title: input.new_task_title
							}
						}
					}
				},
				include: {
					tasks: {
						orderBy: {
							createdAt: 'asc'
						}
					}
				}
			});

			return cardWithUpdatedTask;
		}),
	editTaskCompleted: publicProcedure
		.input(z.object({ card_id: z.string(), task_id: z.string(), completed: z.boolean() }))
		.mutation(async ({ input, ctx }) => {
			const cardWithUpdatedTask = await ctx.p.card.update({
				where: { id: input.card_id },
				data: {
					tasks: {
						update: {
							where: { id: input.task_id },
							data: {
								completed: !input.completed
							}
						}
					}
				},
				include: {
					tasks: {
						orderBy: {
							createdAt: 'asc'
						}
					}
				}
			});

			return cardWithUpdatedTask;
		}),
	deleteTask: publicProcedure
		.input(z.object({ card_id: z.string(), task_id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const cardWithRemovedTask = await ctx.p.card.update({
				where: { id: input.card_id },
				data: {
					tasks: {
						delete: { id: input.task_id }
					}
				},
				include: {
					tasks: {
						orderBy: {
							createdAt: 'asc'
						}
					}
				}
			});

			return cardWithRemovedTask;
		})
});
