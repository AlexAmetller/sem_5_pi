import { QueryClient } from '@tanstack/react-query'

export { useWarehouse, useWarehouses, saveWarehouse } from './warehouse'
export { useTruck, useTrucks, saveTruck, updateTruckStatus } from './truck'
export { useDelivery, useDeliveries, saveDelivery } from './delivery'
export { usePackaging, usePackagings, savePackaging } from './packaging'
export { useSchedule, useSchedules, saveSchedule } from './schedule'
export { usePath, usePaths, savePath } from './path'
export { useUser, useUsers, saveUser, deleteUser } from './user'

export const queryClient = new QueryClient()
