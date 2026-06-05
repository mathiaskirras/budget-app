import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const body = await readBody(event);

  return prisma.category.update({
    where: {
      id: body.id,
      budgetId: budget.id,
    },
    data: {
      name: body.name,
      description: body.description ?? null,
      colorHex: body.colorHex,
      type: body.type,
      target: body.target ?? null,
    },
  });
});