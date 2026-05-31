import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const budgetId = query.budgetId as string;
  const year = Number(query.year);
  const month = Number(query.month);

  if (!budgetId || !year || !month) {
    throw createError({
      statusCode: 400,
      statusMessage: 'budgetId, year and month are required',
    });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return prisma.transaction.findMany({
    where: {
      budgetId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
});