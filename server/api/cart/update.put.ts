import { z } from 'zod'

const bodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    cart: {
      id: 'cart_mock',
      items: [
        {
          id: body.itemId,
          productId: 'product_mock',
          variantId: null,
          quantity: body.quantity,
          date: null,
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
