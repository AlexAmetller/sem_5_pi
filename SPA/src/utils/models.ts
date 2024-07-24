import { Delivery } from '../types/delivery'
import { Warehouse } from '../types/warehouse'
import { TruckForm } from '../types/truck'
import { Packaging } from '../types/packaging'
import { Path } from '../types/path'
import { UserForm } from '../types/auth'

export const emptyWarehouse = () => {
  const w: Warehouse = {
    enabled: true,
    code: '',
    description: '',
    address: {
      city: '',
      country: '',
      postalCode: '',
      street: '',
    },
    coordinates: {
      latitude: NaN,
      longitude: NaN,
    },
  }
  return w
}

export const emptyTruck = () => {
  const t: TruckForm = {
    id: '',
    tare: NaN,
    maxWeight: NaN,
    maxCharge: NaN,
    range: NaN,
    chargingTime: NaN,
    enabled: true,
  }
  return t
}

export const emptyDelivery = (warehouseCode: string) => {
  const d: Delivery = {
    code: '',
    date: new Date(),
    mass: NaN,
    destinationWarehouseCode: warehouseCode,
    loadingTime: NaN,
    withdrawingTime: NaN,
  }
  return d
}

export const emptyPackaging = (delivery = '') => {
  const p: Packaging = {
    id: '',
    deliveryId: delivery,
    xposition: NaN,
    yposition: NaN,
    zposition: NaN,
    loadingTime: NaN,
    withdrawingTime: NaN,
  }
  return p
}

export const emptyPath = (
  truckId: string,
  startWarehouse: string,
  endWarehouse: string
) => {
  const p: Path = {
    id: '',
    truckId: truckId,
    startWarehouse: startWarehouse,
    endWarehouse: endWarehouse,
    distance: NaN,
    time: NaN,
    batteryConsumption: NaN,
  }
  return p
}

export const emptyUser = () => {
  const user: UserForm = {
    mail: '',
    name: '',
    role: 'warehouse-manager',
    password: '',
    phoneNumber: '',
  }
  return user
}
