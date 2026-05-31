import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction id is required',
    });
  }

  return prisma.transaction.update({
    where: {
      id: body.id,
    },
    data: {
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