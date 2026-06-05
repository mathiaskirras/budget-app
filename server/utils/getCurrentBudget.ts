import { serverSupabaseUser } from '#supabase/server';
import { prisma } from './prisma';

export const getCurrentBudget = async (event: any) => {
  const user = await serverSupabaseUser(event);

  const userId = user?.sub;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return prisma.budget.findFirstOrThrow({
    where: {
      userId,
    },
  });
};