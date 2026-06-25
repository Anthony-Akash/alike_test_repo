import { z } from 'zod'

const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  packageId: z.string(),
  travelDates: z.object({
    from: z.string(),
    to: z.string(),
  }),
  guests: z.number().min(1),
  message: z.string().optional(),
})

export function useLeadForm(_packageId: string) {
  const { t } = useI18n()
  const toast = useToast()
  const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function submitLead(data: z.infer<typeof leadSchema>) {
    status.value = 'submitting'
    try {
      await $fetch('/api/leads/submit', { method: 'POST', body: data })
      status.value = 'success'
      toast.success(t('leads.success'))
    } catch {
      status.value = 'error'
      toast.error(t('leads.error'))
    }
  }

  return { leadSchema, submitLead, status }
}
