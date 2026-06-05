import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction id is required',
    });
  }

  return prisma.transaction.findFirstOrThrow({
    where: {
      id,
      budgetId: budget.id,
    },
    include: {
      category: true,
    },
  });
});