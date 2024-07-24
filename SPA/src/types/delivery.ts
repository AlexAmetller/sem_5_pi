import z from 'zod'
import { zDate } from './common'
import { zWarehouse } from './warehouse'

export const zDelivery = z.object({
  code: z.string().regex(/^[a-zA-Z0-9]{4}$/, 'Invalid pattern'),
  date: zDate,
  mass: z.number().min(0).max(400),
  loadingTime: z.number().min(0).max(999),
  withdrawingTime: z.number().min(0).max(999),
  destinationWarehouseCode: z.string(),
})

export const zFullDelivery = zDelivery.extend({
  destinationWarehouse: zWarehouse,
})

export const zDeliveries = z.array(zDelivery)
export const zFullDeliveries = z.array(zFullDelivery)
export type Delivery = z.infer<typeof zDelivery>
export type FullDelivery = z.infer<typeof zFullDelivery>
