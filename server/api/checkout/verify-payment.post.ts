import { z } from 'zod'

const bodySchema = z.object({
  paymentIntentId: z.string().min(1),
  orderId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    order: {
      id: body.orderId,
      paymentIntentId: body.paymentIntentId,
      status: 'confirmed' as const,
      paidAt: new Date().toISOString(),
    },
  }
})
