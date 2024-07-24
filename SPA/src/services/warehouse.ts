import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import { Warehouse, zWarehouse, zWarehouses } from '../types/warehouse'
import config from '../utils/config'
import { makeHeaders } from '../utils/auth'
import useAuth from '../hooks/auth'

export const useWarehouses = () => {
  const { renewToken } = useAuth()
  return useQuery(
    ['warehouse'],
    () =>
      fetch(`${config.WAREHOUSE_URL}/warehouse`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zWarehouses.parse(json))
      }),
    { keepPreviousData: true }
  )
}

export const useWarehouse = (code: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['warehouse', code],
    () =>
      fetch(`${config.WAREHOUSE_URL}/warehouse/${code}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zWarehouse.parse(json))
      }),
    { enabled: Boolean(code) }
  )
}

export const saveWarehouse = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['warehouse'],
    (w: Warehouse) =>
      fetch(`${config.WAREHOUSE_URL}/warehouse${create ? '' : `/${w.code}`}`, {
        method: create ? 'POST' : 'PUT',
        headers: makeHeaders(),
        body: JSON.stringify(w),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.message) throw new Error(json.message)
          throw new Error(`Saving warehouse failed`)
        }
        return await res.json().then((json) => zWarehouse.parse(json))
      }),
    {
      onSuccess: (w: Warehouse) => {
        queryClient.invalidateQueries(['warehouse'])
        if (!create) {
          queryClient.invalidateQueries(['warehouse', w.code])
        }
      },
    }
  )
}
