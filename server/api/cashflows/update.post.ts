import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cashflow id is required',
    });
  }

  return prisma.cashflowItem.update({
    where: {
      id: body.id,
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