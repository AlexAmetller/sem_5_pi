import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import { Pagination } from '../interfaces'
import { Path, PathForm, zPath, zPaths } from '../types/path'
import config from '../utils/config'
import { makeURLParameters } from '../utils/pagination'
import { makeHeaders } from '../utils/auth'
import useAuth from '../hooks/auth'

export const usePaths = (pagination: Pagination) => {
  const { renewToken } = useAuth()
  const query = makeURLParameters(pagination)
  return useQuery(
    ['path', query.toString()],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/paths?${query.toString()}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => ({
          paths: zPaths.parse(json),
          totalCount: Number(res.headers.get('X-Total-Count')),
        }))
      }),
    { keepPreviousData: true }
  )
}

export const usePath = (code: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['path', code],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/paths/${code}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zPath.parse(json))
      }),
    { enabled: Boolean(code) }
  )
}

export const savePath = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['path'],
    (p: PathForm & { id: string }) =>
      fetch(`${config.LOGISTICS_URL}/api/paths${create ? '' : `/${p.id}`}`, {
        method: create ? 'POST' : 'PUT',
        headers: makeHeaders(),
        body: JSON.stringify({
          ...(create && { truckId: p.truckId }),
          startWarehouse: p.startWarehouse,
          endWarehouse: p.endWarehouse,
          distance: p.distance,
          time: p.time,
          batteryConsumption: p.batteryConsumption,
        }),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.errors && typeof json.errors === 'string')
            throw new Error(json.errors)
          throw new Error(`Saving path failed`)
        }
        return await res.json().then((json) => zPath.parse(json))
      }),
    {
      onSuccess: (w: Path) => {
        queryClient.invalidateQueries(['path'])
        if (!create) {
          queryClient.invalidateQueries(['path', w.id])
        }
      },
    }
  )
}
