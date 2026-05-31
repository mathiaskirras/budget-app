import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return prisma.category.create({
    data: {
      budgetId: body.budgetId,
      name: body.name,
      description: body.description ?? null,
      colorHex: body.colorHex,
      type: body.type,
      target: body.target ?? null,
    },
  });
});