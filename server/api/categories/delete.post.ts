import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  await prisma.category.delete({
    where: {
      id: body.id,
    },
  });

  return {
    success: true,
  };
});