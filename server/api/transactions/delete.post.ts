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

  await prisma.transaction.delete({
    where: {
      id: transaction.id,
    },
  });

  return {
    success: true,
  };
});