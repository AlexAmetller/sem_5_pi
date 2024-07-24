import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '.'
import useAuth from '../hooks/auth'
import { User, UserForm, zUser, zUsers } from '../types/auth'
import { makeHeaders } from '../utils/auth'
import config from '../utils/config'

export const useUsers = () => {
  const { renewToken } = useAuth()
  return useQuery(
    ['user'],
    () =>
      fetch(`${config.AUTHZ_URL}/users`, { headers: makeHeaders() }).then(
        async (res) => {
          if (res.status === 401) renewToken()
          return res.json().then(async (json) => zUsers.parse(json))
        }
      ),
    { keepPreviousData: true }
  )
}

export const useUser = (mail: string | undefined) => {
  const { renewToken } = useAuth()
  return useQuery(
    ['user', mail],
    () =>
      fetch(`${config.AUTHZ_URL}/users/${encodeURIComponent(mail ?? '')}`, {
        headers: makeHeaders(),
      }).then(async (res) => {
        if (res.status === 401) renewToken()
        return res.json().then(async (json) => zUser.parse(json))
      }),
    { enabled: Boolean(mail) }
  )
}

export const saveUser = (create: boolean) => {
  const { renewToken } = useAuth()
  return useMutation(
    ['user'],
    (user: UserForm) =>
      fetch(
        `${config.AUTHZ_URL}/users${
          create ? '' : `/${encodeURIComponent(user.mail)}`
        }`,
        {
          method: create ? 'POST' : 'PATCH',
          headers: makeHeaders(),
          body: JSON.stringify({
            ...(create && { password: user.password }),
            ...(create && { mail: user.mail }),
            ...(create && { phoneNumber: user.phoneNumber }),
            name: user.name,
            role: user.role,
          }),
        }
      ).then(async (res) => {
        if (res.status === 401) renewToken()
        if (res.status !== 201 && res.status !== 200) {
          const json = await res.json()
          if (json.errors && typeof json.errors === 'string')
            throw new Error(json.errors)
          throw new Error(`Saving user failed`)
        }
        return await res.json().then((json) => zUser.parse(json))
      }),
    {
      onSuccess: (user: User) => {
        queryClient.invalidateQueries(['user'])
        if (!create) {
          queryClient.invalidateQueries(['user', user.mail])
        }
      },
    }
  )
}

export const deleteUser = () => {
  const { renewToken } = useAuth()
  return useMutation(
    ['user'],
    (mail: string) =>
      fetch(`${config.AUTHZ_URL}/users/${encodeURIComponent(mail)}`, {
        method: 'DELETE',
        headers: makeHeaders(),
      }).then((res) => {
        if (res.status === 401) renewToken()
        if (!(res.status === 200))
          throw new Error(`Failed deleting user ${mail}`)
        return true
      }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user'])
      },
    }
  )
}
