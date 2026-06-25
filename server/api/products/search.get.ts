import { z } from 'zod'

const querySchema = z.object({
  q: z.string().min(1),
  type: z.enum(['attraction', 'pass', 'hotel', 'holiday-package', 'deal']).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  return {
    items: [],
    total: 0,
    page: query.page,
    limit: query.limit,
    totalPages: 0,
    hasMore: false,
    query: query.q,
    suggestions: [],
  }
})
