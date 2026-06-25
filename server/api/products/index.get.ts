import { z } from 'zod'

const querySchema = z.object({
  type: z.enum(['attraction', 'pass', 'hotel', 'holiday-package', 'deal']).optional(),
  category: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).default('newest'),
  q: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  return { items: [], total: 0, page: query.page, limit: query.limit, totalPages: 0, hasMore: false }
})
