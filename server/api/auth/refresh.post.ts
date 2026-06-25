import { z } from 'zod'

const bodySchema = z.object({
  refreshToken: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    accessToken: 'mock_new_access_token',
    refreshToken: 'mock_new_refresh_token',
    expiresIn: 3600,
  }
})
