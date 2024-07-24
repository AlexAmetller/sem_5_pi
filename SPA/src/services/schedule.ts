import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import { ScheduleForm, zSchedule, zSchedules } from '../types/schedule'
import config from '../utils/config'
import { makeHeaders } from '../utils/auth'
import useAuth from '../hooks/auth'
import { makeURLParameters } from '../utils/pagination'
import { Pagination } from '../interfaces'

export const useSchedules = (pagination: Pagination) => {
  const { renewToken } = useAuth()
  const query = makeURLParameters(pagination)
  return useQuery(
    ['schedule', query.toString()],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/schedules?${query.toString()}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => ({
          schedules: zSchedules.parse(json),
          totalCount: Number(res.headers.get('X-Total-Count')),
        }))
      }),
    { keepPreviousData: true }
  )
}

export const useSchedule = (code: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['schedule', code],
    () =>
      fetch(`${config.LOGISTICS_URL}/api/schedules/${code}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zSchedule.parse(json))
      }),
    { enabled: Boolean(code) }
  )
}

export const saveSchedule = () => {
  const { renewToken } = useAuth()
  return useMutation(
    ['schedule'],
    (w: ScheduleForm) =>
      fetch(`${config.LOGISTICS_URL}/api/schedules`, {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify(w),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.errors && typeof (json.errors === 'string')) {
            throw new Error(`${json.errors}`)
          }
          throw new Error(`Saving schedule failed`)
        }
        return await res.json().then((json) => zSchedule.parse(json))
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedule'])
      },
    }
  )
}
