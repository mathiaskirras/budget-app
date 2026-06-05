import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const body = await readBody(event);

  await prisma.category.findFirstOrThrow({
    where: {
      id: body.categoryId,
      budgetId: budget.id,
    },
  });

  return prisma.transaction.create({
    data: {
      budgetId: budget.id,
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