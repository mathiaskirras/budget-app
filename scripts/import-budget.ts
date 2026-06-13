import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const adapter = new PrismaPg({
  connectionString: "postgresql://postgres.zpaghilvzenwyexevedp:gieTUR5fRN5nO0of@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"!,
})

const prisma = new PrismaClient({ adapter })

const USER_ID = '0feda932-bdb6-4a04-8814-c6e61e924b42'
const IMPORT_BUDGET_NAME = 'Mathias\' budget'
const IMPORT_FILE_PATH = path.resolve(
  'imports',
  'budget-import-2017-2025.json',
)

type ImportData = {
  budget: {
    name?: string
  }
  categories: {
    name: string
    description: string | null
    colorHex: string
    type: 'EXPENSE' | 'SAVING' | 'INVESTMENT'
    target: string | number | null
  }[]
  cashflows: {
    incomes: CashflowImport[]
    fixedExpenses: CashflowImport[]
  }
  months: {
    month: string
    transactions: TransactionImport[]
  }[]
}

type CashflowImport = {
  name: string
  description?: string | null
  amount: number
  startDate: string
  endDate: string | null
}

type TransactionImport = {
  amount: number
  category: string
  date: string
  sortOrder: number
  description: string | null
}

function createTransactionDate(date: string, sortOrder: number): Date {
  const transactionDate = new Date(`${date}T00:00:00.000Z`)

  transactionDate.setUTCMinutes(Math.floor(sortOrder))

  return transactionDate
}

async function main() {
  const raw = await readFile(IMPORT_FILE_PATH, 'utf8')
  const importData = JSON.parse(raw) as ImportData

  const existingBudget = await prisma.budget.findFirst({
    where: {
      userId: USER_ID,
      name: IMPORT_BUDGET_NAME,
    },
  })

  if (existingBudget) {
    await prisma.budget.delete({
      where: {
        id: existingBudget.id,
      },
    })
  }

  const budget = await prisma.budget.create({
    data: {
      userId: USER_ID,
      name: IMPORT_BUDGET_NAME,
    },
  })

  const categoryByName = new Map<string, string>()

  for (const category of importData.categories) {
    const createdCategory = await prisma.category.create({
      data: {
        budgetId: budget.id,
        name: category.name,
        description: category.description,
        colorHex: category.colorHex,
        type: category.type,
        target: category.target,
      },
    })

    categoryByName.set(category.name, createdCategory.id)
  }

  for (const income of importData.cashflows.incomes) {
    await prisma.cashflowItem.create({
      data: {
        budgetId: budget.id,
        type: 'INCOME',
        name: income.name,
        description: income.description ?? null,
        amount: income.amount,
        startDate: new Date(`${income.startDate}T00:00:00.000Z`),
        endDate: income.endDate ? new Date(`${income.endDate}T00:00:00.000Z`) : null,
      },
    })
  }

  for (const fixedExpense of importData.cashflows.fixedExpenses) {
    await prisma.cashflowItem.create({
      data: {
        budgetId: budget.id,
        type: 'FIXED_EXPENSE',
        name: fixedExpense.name,
        description: fixedExpense.description ?? null,
        amount: fixedExpense.amount,
        startDate: new Date(`${fixedExpense.startDate}T00:00:00.000Z`),
        endDate: fixedExpense.endDate ? new Date(`${fixedExpense.endDate}T00:00:00.000Z`) : null,
      },
    })
  }

  let transactionCount = 0

  for (const month of importData.months) {
    for (const transaction of month.transactions) {
      const categoryId = categoryByName.get(transaction.category)

      if (!categoryId) {
        throw new Error(`Unknown category: ${transaction.category}`)
      }

      await prisma.transaction.create({
        data: {
          budgetId: budget.id,
          categoryId,
          amount: transaction.amount,
          date: createTransactionDate(transaction.date, transaction.sortOrder),
          description: transaction.description,
        },
      })

      transactionCount++
    }
  }

  console.log(`Imported budget: ${budget.id}`)
  console.log(`Imported categories: ${importData.categories.length}`)
  console.log(`Imported incomes: ${importData.cashflows.incomes.length}`)
  console.log(`Imported fixed expenses: ${importData.cashflows.fixedExpenses.length}`)
  console.log(`Imported transactions: ${transactionCount}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
