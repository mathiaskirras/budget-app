import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cashflow id is required',
    });
  }

  const cashflow = await prisma.cashflowItem.findFirstOrThrow({
    where: {
      id: body.id,
      budgetId: budget.id,
    },
  });

  return prisma.cashflowItem.update({
    where: {
      id: cashflow.id,
    },
    data: {
      type: body.type,
      name: body.name,
      description: body.description ?? null,
      amount: body.amount,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
});