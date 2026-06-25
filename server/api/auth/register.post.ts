import { z } from 'zod'

const bodySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const _config = useRuntimeConfig()
  const body = await readValidatedBody(event, bodySchema.parse)

  return {
    success: true,
    user: {
      id: 'user_mock',
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone ?? null,
    },
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
    expiresIn: 3600,
  }
})
