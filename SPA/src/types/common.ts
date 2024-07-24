import { z } from 'zod'

export const zDate = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}, z.date())
