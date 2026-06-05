import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category id is required',
    });
  }

  return prisma.category.findFirstOrThrow({
    where: {
      id,
      budgetId: budget.id,
    },
  });
});