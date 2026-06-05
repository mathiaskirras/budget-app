import { getCurrentBudget } from '../../utils/getCurrentBudget';
import { prisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
  const budget = await getCurrentBudget(event);
  const query = getQuery(event);

  const year = Number(query.year);
  const month = Number(query.month);
  const mode = query.mode === 'year' ? 'year' : 'month';

  if (!year || !month) {
    throw createError({
      statusCode: 400,
      statusMessage: 'year and month are required',
    });
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const startDate = mode === 'year'
    ? new Date(year, 0, 1)
    : new Date(year, month - 1, 1);

  const endDate = (() => {
    if (mode === 'month') {
      return new Date(year, month, 1);
    }

    if (year === currentYear) {
      return new Date(year, currentMonth, 1);
    }

    return new Date(year + 1, 0, 1);
  })();

  const periodEndDate = new Date(endDate.getTime() - 1);

  const monthsBetween = (start: Date, end: Date) => {
    return (end.getFullYear() - start.getFullYear()) * 12
      + end.getMonth()
      - start.getMonth()
      + 1;
  };

  const getActiveMonthsInPeriod = (
    itemStartDate: Date,
    itemEndDate: Date | null,
  ) => {
    const activeStart = itemStartDate > startDate
      ? itemStartDate
      : startDate;

    const activeEnd = itemEndDate && itemEndDate < periodEndDate
      ? itemEndDate
      : periodEndDate;

    if (activeStart > activeEnd) {
      return 0;
    }

    return monthsBetween(activeStart, activeEnd);
  };

  const categories = await prisma.category.findMany({
    where: {
      budgetId: budget.id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      budgetId: budget.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const cashflows = await prisma.cashflowItem.findMany({
    where: {
      budgetId: budget.id,
      startDate: {
        lt: endDate,
      },
      OR: [
        {
          endDate: null,
        },
        {
          endDate: {
            gte: startDate,
          },
        },
      ],
    },
  });

  const periodMonths = monthsBetween(startDate, periodEndDate);

  const income = cashflows
    .filter((cashflow) => {
      return cashflow.type === 'INCOME';
    })
    .reduce((total, cashflow) => {
      return total + Number(cashflow.amount) * getActiveMonthsInPeriod(
        cashflow.startDate,
        cashflow.endDate,
      );
    }, 0);

  const fixedExpenses = cashflows
    .filter((cashflow) => {
      return cashflow.type === 'FIXED_EXPENSE';
    })
    .reduce((total, cashflow) => {
      return total + Number(cashflow.amount) * getActiveMonthsInPeriod(
        cashflow.startDate,
        cashflow.endDate,
      );
    }, 0);

  const extraIncome = transactions
    .filter((transaction) => {
      return Number(transaction.amount) < 0;
    })
    .reduce((total, transaction) => {
      return total + Math.abs(Number(transaction.amount));
    }, 0);

  const categorySpending = categories.map((category) => {
    const spent = transactions
      .filter((transaction) => {
        return transaction.categoryId === category.id
          && Number(transaction.amount) > 0;
      })
      .reduce((total, transaction) => {
        return total + Number(transaction.amount);
      }, 0);

    const target = category.target === null
      ? null
      : Number(category.target) * periodMonths;

    return {
      categoryId: category.id,
      categoryName: category.name,
      colorHex: category.colorHex,
      type: category.type,
      target,
      spent,
    };
  });

  const spent = categorySpending
    .filter((category) => {
      return category.type === 'EXPENSE';
    })
    .reduce((total, category) => {
      return total + category.spent;
    }, 0);

  const saved = categorySpending
    .filter((category) => {
      return category.type === 'SAVING';
    })
    .reduce((total, category) => {
      return total + category.spent;
    }, 0);

  const invested = categorySpending
    .filter((category) => {
      return category.type === 'INVESTMENT';
    })
    .reduce((total, category) => {
      return total + category.spent;
    }, 0);

  const remaining = income
    + extraIncome
    - fixedExpenses
    - spent
    - saved
    - invested;

  return {
    income,
    extraIncome,
    fixedExpenses,
    spent,
    saved,
    invested,
    remaining,
    categorySpending,
  };
});