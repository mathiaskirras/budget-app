import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return prisma.cashflowItem.create({
    data: {
      budgetId: body.budgetId,
      type: body.type,
      name: body.name,
      description: body.description ?? null,
      amount: body.amount,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
    },
  });
});