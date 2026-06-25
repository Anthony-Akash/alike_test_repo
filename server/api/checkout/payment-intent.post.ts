import { z } from 'zod'

const bodySchema = z.object({
  orderId: z.string().min(1),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']).default('card'),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    paymentIntent: {
      id: 'pi_mock',
      clientSecret: 'pi_mock_secret',
      orderId: body.orderId,
      amount: { amount: 0, currency: 'AED' },
      status: 'requires_payment_method' as const,
    },
  }
})
