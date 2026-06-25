import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  return {
    id,
    orderNumber: 'VDD-000001',
    status: 'confirmed' as const,
    contact: {
      firstName: '',
      lastName: '',
      email: '',
      phone: null,
    },
    items: [],
    subtotal: { amount: 0, currency: 'AED' },
    tax: { amount: 0, currency: 'AED' },
    discount: { amount: 0, currency: 'AED' },
    total: { amount: 0, currency: 'AED' },
    payment: {
      method: 'card',
      status: 'paid',
      paidAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})
