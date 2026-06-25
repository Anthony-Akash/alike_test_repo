import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  status: z.enum(['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded']).optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  return {
    orders: [],
    total: 0,
    page: query.page,
    limit: query.limit,
    totalPages: 0,
    hasMore: false,
  }
})
