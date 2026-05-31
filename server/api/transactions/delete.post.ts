import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction id is required',
    });
  }

  await prisma.transaction.delete({
    where: {
      id: body.id,
    },
  });

  return {
    success: true,
  };
});