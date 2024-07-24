import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import {
  Packaging,
  PackagingForm,
  zPackaging,
  zPackagings,
} from '../types/packaging'
import config from '../utils/config'
import { makeHeaders } from '../utils/auth'
import useAuth from '../hooks/auth'
import { makeURLParameters } from '../utils/pagination'
import { Pagination } from '../interfaces'

export const usePackagings = (pagination: Pagination) => {
  const query = makeURLParameters(pagination)
  const { renewToken } = useAuth()
  return useQuery(
    ['packaging', query.toString()],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/packagings?${query.toString()}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => ({
          packagings: zPackagings.parse(json),
          totalCount: Number(res.headers.get('X-Total-Count')),
        }))
      }),
    { keepPreviousData: true }
  )
}

export const usePackaging = (code: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['packaging', code],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/packagings/${code}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zPackaging.parse(json))
      }),
    { enabled: Boolean(code) }
  )
}

export const savePackaging = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['packaging'],
    (p: PackagingForm & { id: string }) =>
      fetch(
        `${config.LOGISTICS_URL}/api/packagings${create ? '' : `/${p.id}`}`,
        {
          method: create ? 'POST' : 'PUT',
          headers: makeHeaders(),
          body: JSON.stringify({
            ...(create && { deliveryId: p.deliveryId }),
            xposition: p.xposition,
            yposition: p.yposition,
            zposition: p.zposition,
          }),
        }
      ).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.message) throw new Error(json.message)
          throw new Error(`Saving packaging failed`)
        }
        return await res.json().then((json) => zPackaging.parse(json))
      }),
    {
      onSuccess: (p: Packaging) => {
        queryClient.invalidateQueries(['packaging'])
        if (!create) {
          queryClient.invalidateQueries(['packaging', p.id])
        }
      },
    }
  )
}
