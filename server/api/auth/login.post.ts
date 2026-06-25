import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    user: {
      id: 'user_mock',
      email: body.email,
      firstName: 'Mock',
      lastName: 'User',
    },
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
    expiresIn: 3600,
  }
})
