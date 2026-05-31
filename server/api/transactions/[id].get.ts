import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction id is required',
    });
  }

  return prisma.transaction.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
});