import { z } from 'zod'

const bodySchema = z.object({
  itemId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    removedItemId: body.itemId,
    cart: {
      id: 'cart_mock',
      items: [],
      subtotal: { amount: 0, currency: 'AED' },
      tax: { amount: 0, currency: 'AED' },
      total: { amount: 0, currency: 'AED' },
      itemCount: 0,
    },
  }
})
