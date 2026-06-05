import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction id is required',
    });
  }

  const transaction = await prisma.transaction.findFirstOrThrow({
    where: {
      id: body.id,
      budgetId: budget.id,
    },
  });

  await prisma.category.findFirstOrThrow({
    where: {
      id: body.categoryId,
      budgetId: budget.id,
    },
  });

  return prisma.transaction.update({
    where: {
      id: transaction.id,
    },
    data: {
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