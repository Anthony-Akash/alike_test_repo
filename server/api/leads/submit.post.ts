import { z } from 'zod'

const bodySchema = z.object({
  productId: z.string().min(1),
  productType: z.enum(['holiday-package', 'hotel', 'attraction']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  travelDates: z.object({
    from: z.string(),
    to: z.string(),
  }).optional(),
  guests: z.number().int().positive().optional(),
  message: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    lead: {
      id: 'lead_mock',
      productId: body.productId,
      email: body.email,
      status: 'submitted' as const,
      createdAt: new Date().toISOString(),
    },
  }
})
