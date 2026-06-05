import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const body = await readBody(event);

  await prisma.category.delete({
    where: {
      id: body.id,
      budgetId: budget.id,
    },
  });

  return {
    success: true,
  };
});