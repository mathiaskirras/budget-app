import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);

  return prisma.cashflowItem.findMany({
    where: {
      budgetId: budget.id,
    },
    orderBy: [
      {
        type: 'asc',
      },
      {
        name: 'asc',
      },
    ],
  });
});