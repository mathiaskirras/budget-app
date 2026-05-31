import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return prisma.transaction.create({
    data: {
      budgetId: body.budgetId,
      categoryId: body.categoryId,
      amount: body.amount,
      date: new Date(body.date),
      description: body.description ?? null,
    },
    include: {
      category: true,
    },
  });
});