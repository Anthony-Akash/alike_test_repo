import { z } from 'zod'

const paramsSchema = z.object({
  slug: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { slug } = await getValidatedRouterParams(event, paramsSchema.parse)

  return {
    slug,
    title: '',
    description: '',
    type: 'attraction' as const,
    price: { amount: 0, currency: 'AED' },
    images: [],
    highlights: [],
    included: [],
    excluded: [],
    duration: null,
    cancellationPolicy: null,
    variants: [],
    rating: { average: 0, count: 0 },
    category: '',
    available: true,
  }
})
