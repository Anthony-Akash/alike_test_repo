import { z } from 'zod'

const paramsSchema = z.object({
  slug: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const { slug } = await getValidatedRouterParams(event, paramsSchema.parse)

  return {
    slug,
    title: '',
    content: '',
    sections: [],
    seo: {
      title: '',
      description: '',
      ogImage: null,
    },
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})
