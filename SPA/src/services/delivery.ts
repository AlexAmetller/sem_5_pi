import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import { Delivery, zDelivery, zDeliveries } from '../types/delivery'
import config from '../utils/config'
import useAuth from '../hooks/auth'
import { makeHeaders } from '../utils/auth'

export const useDeliveries = () => {
  const { renewToken } = useAuth()
  return useQuery(
    ['delivery'],
    () =>
      fetch(`${config.WAREHOUSE_URL}/delivery`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zDeliveries.parse(json))
      }),
    { keepPreviousData: true }
  )
}

export const useDelivery = (code: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['delivery', code],
    () =>
      fetch(`${config.WAREHOUSE_URL}/delivery/${code}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zDelivery.parse(json))
      }),
    { enabled: Boolean(code) }
  )
}

export const saveDelivery = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['delivery'],
    (w: Delivery) =>
      fetch(`${config.WAREHOUSE_URL}/delivery${create ? '' : `/${w.code}`}`, {
        method: create ? 'POST' : 'PUT',
        headers: makeHeaders(),
        body: JSON.stringify(w),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.message) throw new Error(json.message)
          throw new Error(`Saving delivery failed`)
        }
        return await res.json().then((json) => zDelivery.parse(json))
      }),
    {
      onSuccess: (w: Delivery) => {
        queryClient.invalidateQueries(['delivery'])
        if (!create) {
          queryClient.invalidateQueries(['delivery', w.code])
        }
      },
    }
  )
}
