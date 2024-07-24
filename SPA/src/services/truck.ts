import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import { Truck, TruckForm, zTruck, zTrucks } from '../types/truck'
import config from '../utils/config'
import { makeHeaders } from '../utils/auth'
import useAuth from '../hooks/auth'

export const useTrucks = () => {
  const { renewToken } = useAuth()
  return useQuery(
    ['truck'],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/trucks`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zTrucks.parse(json))
      }),
    { keepPreviousData: true }
  )
}

export const useTruck = (id: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['truck', id],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/trucks/${id}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zTruck.parse(json))
      }),
    { enabled: Boolean(id) }
  )
}

export const saveTruck = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['truck'],
    (t: TruckForm) =>
      fetch(`${config.LOGISTICS_URL}/api/trucks${create ? '' : `/${t.id}`}`, {
        method: create ? 'POST' : 'PUT',
        headers: makeHeaders(),
        body: JSON.stringify({
          ...(create && { id: t.id }),
          ...(!create && { enabled: t.enabled }),
          tare: t.tare,
          maxWeight: t.maxWeight,
          maxCharge: t.maxCharge,
          range: t.range,
          chargingTime: t.chargingTime,
        }),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.errors && typeof json.errors === 'string')
            throw new Error(json.errors)
          throw new Error(`Saving truck failed`)
        }
        return await res.json().then((json) => zTruck.parse(json))
      }),
    {
      onSuccess: (w: Truck) => {
        queryClient.invalidateQueries(['truck'])
        if (!create) {
          queryClient.invalidateQueries(['truck', w.id])
        }
      },
    }
  )
}

export const updateTruckStatus = (id: string) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['truck'],
    (enabled: boolean) =>
      fetch(`${config.LOGISTICS_URL}/api/trucks/${id}`, {
        method: 'PATCH',
        headers: makeHeaders(),
        body: JSON.stringify({ enabled }),
      }).then((res) => {
        if (res.status === 401) renewToken()
        if (!(res.status === 200))
          throw new Error(`Failed changing truck ${id} status`)
        return true
      }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['truck'])
      },
    }
  )
}
