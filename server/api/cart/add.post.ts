import { z } from 'zod'

const bodySchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  date: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    cart: {
      id: 'cart_mock',
      items: [
        {
          id: 'item_mock',
          productId: body.productId,
          variantId: body.variantId ?? null,
          quantity: body.quantity,
          date: body.date ?? null,
          price: { amount: 0, currency: 'AED' },
        },
      ],
      subtotal: { amount: 0, currency: 'AED' },
      tax: { amount: 0, currency: 'AED' },
      total: { amount: 0, currency: 'AED' },
      itemCount: 1,
    },
  }
})
