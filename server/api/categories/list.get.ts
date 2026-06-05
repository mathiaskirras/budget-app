import { prisma } from '../../utils/prisma';
import { getCurrentBudget } from '../../utils/getCurrentBudget';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);

  return prisma.category.findMany({
    where: {
      budgetId: budget.id,
    },
    orderBy: {
      name: 'asc',
    },
  });
});