import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const budgetId = query.budgetId as string;

  if (!budgetId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'budgetId is required',
    });
  }

  return prisma.cashflowItem.findMany({
    where: {
      budgetId,
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