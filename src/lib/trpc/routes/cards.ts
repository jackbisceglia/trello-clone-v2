import { router, publicProcedure, protectedProcedure } from '../router';
import { z } from 'zod';

export const cardRouter = router({
	getCardsById: protectedProcedure.query(async ({ ctx }) => {
		const cards = await ctx.p.card.findMany({
			where: {
				userId: ctx.session.user.id
			},
			include: {
				tasks: {
					orderBy: {
						createdAt: 'asc'
					}
				}
			},
			orderBy: {
				order: 'desc'
			}
		});

		return cards;
	}),
	createCard: protectedProcedure
		.input(z.object({ title: z.string(), order: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const newCard = await ctx.p.card.create({
				data: {
					userId: ctx.session.user.id,
					title: input.title,
					order: input.order,
					tasks: {
						create: []
					}
				},
				include: {
					tasks: true
				}
			});

			return newCard;
		}),
	editCardTitle: protectedProcedure
		.input(z.object({ card_id: z.string(), new_card_title: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const updatedCard = await ctx.p.card.update({
				where: {
					id: input.card_id
				},
				data: { title: input.new_card_title },
				include: {
					tasks: true
				}
			});

			return updatedCard;
		}),
	deleteCard: publicProcedure
		.input(z.object({ card_id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const removedCard = await ctx.p.card.delete({
				where: { id: input.card_id }
			});

			if (!removedCard) return undefined;

			return removedCard;
		})
});
