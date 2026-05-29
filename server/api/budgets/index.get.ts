import { prisma } from '~~/server//utils/prisma';

export default defineEventHandler(async () => {
  const budgets = await prisma.budget.findMany();

  return {
    data: budgets,
  };
});