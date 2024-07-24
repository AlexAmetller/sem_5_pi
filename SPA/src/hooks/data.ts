import { useWarehouses } from '../services'
import { useDeliveries } from '../services/delivery'
import { useTrucks } from '../services/truck'
import { Delivery } from '../types/delivery'
import { Truck } from '../types/truck'
import { Warehouse } from '../types/warehouse'

export const useData = (): {
  loading: boolean
  error: boolean
  data:
    | {
        trucks: Truck[]
        warehouses: Warehouse[]
        deliveries: Delivery[]
      }
    | undefined
} => {
  const {
    data: warehouses,
    isError: warehouseError,
    isLoading: warehouseLoading,
  } = useWarehouses()
  const {
    data: deliveries,
    isError: deliveryError,
    isLoading: deliveryLoading,
  } = useDeliveries()
  const {
    data: trucks,
    isError: truckError,
    isLoading: truckLoading,
  } = useTrucks()

  const loading = warehouseLoading || deliveryLoading || truckLoading
  const error = warehouseError || deliveryError || truckError

  if (!warehouses || !deliveries || !trucks)
    return {
      loading,
      error,
      data: undefined,
    }

  console.log({ trucks })

  return {
    loading,
    error,
    data: {
      warehouses: warehouses.filter((w) => w.enabled),
      deliveries,
      trucks: trucks.filter((t) => t.enabled),
    },
  }
}
