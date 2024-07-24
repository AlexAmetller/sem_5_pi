import z from 'zod'

export const zTruck = z.object({
  // Matricula
  id: z.string().min(3),
  tare: z.number().min(0),
  maxWeight: z.number().min(0),
  maxCharge: z.number().min(0).max(100),
  range: z.number().min(0),
  chargingTime: z.number().min(0),
  enabled: z.boolean(),
})

export const zTruckForm = zTruck.omit({})

export const zTrucks = z.array(zTruck)
export type Truck = z.infer<typeof zTruck>
export type TruckForm = z.infer<typeof zTruckForm>
