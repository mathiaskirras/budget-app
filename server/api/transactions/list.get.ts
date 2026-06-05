import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const query = getQuery(event);

  const year = Number(query.year);
  const month = Number(query.month);
  const mode = query.mode === 'year' ? 'year' : 'month';

  if (!year || !month) {
    throw createError({
      statusCode: 400,
      statusMessage: 'year and month are required',
    });
  }

  const startDate = mode === 'year'
    ? new Date(year, 0, 1)
    : new Date(year, month - 1, 1);

  const endDate = mode === 'year'
    ? new Date(year + 1, 0, 1)
    : new Date(year, month, 1);

  return prisma.transaction.findMany({
    where: {
      budgetId: budget.id,
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