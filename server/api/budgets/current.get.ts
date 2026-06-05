import { serverSupabaseUser } from '#supabase/server';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
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
});