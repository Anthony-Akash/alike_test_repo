import { z } from 'zod'

const bodySchema = z.object({
  cartId: z.string().min(1),
  contact: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().optional(),
  }).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    order: {
      id: 'order_mock',
      orderNumber: 'VDD-000001',
      status: 'pending' as const,
      contact: body.contact,
      items: [],
      subtotal: { amount: 0, currency: 'AED' },
      tax: { amount: 0, currency: 'AED' },
      total: { amount: 0, currency: 'AED' },
      createdAt: new Date().toISOString(),
    },
  }
})
