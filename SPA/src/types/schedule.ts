import z from 'zod'
import { zDate } from './common'
import { zFullDeliveries } from './delivery'
import { zTruck } from './truck'
import { zWarehouse } from './warehouse'

export const zSchedule = z.object({
  id: z.string(),
  truck: zTruck,
  deliveries: zFullDeliveries,
  totalTime: z.number(),
  originWarehouse: zWarehouse,
  date: zDate,
})

export const zScheduleForm = z.object({
  truckId: z.string(),
  originWarehouseId: z.string(),
  deliveryIds: z.array(z.string()).min(1),
})

export const zSchedules = z.array(zSchedule)
export type Schedule = z.infer<typeof zSchedule>
export type ScheduleForm = z.infer<typeof zScheduleForm>
