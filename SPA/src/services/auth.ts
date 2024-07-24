import { CredentialResponse } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'
import { Login } from '../types/auth'
import config from '../utils/config'

export const useLogin = () => {
  return useMutation(
    ['auth'],
    async (login: Login | CredentialResponse) => {
      function isLogin(obj: unknown): obj is Login {
        return Boolean(obj && typeof obj === 'object' && 'mail' in obj)
      }
      const endpoint = isLogin(login) ? 'login' : 'google'
      const body = isLogin(login) ? login : { credential: login.credential }
      return fetch(`${config.AUTHZ_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(async (res) => {
        if (res.status !== 200) {
          const json = await res.json()
          if (json.message) throw new Error(json.message)
          throw new Error(`Invalid credentials`)
        }
        return await res
          .json()
          .then((json: { token: string; refresh: string }) => json)
      })
    },
    {}
  )
}

export const useRenewToken = () => {
  return useMutation(
    ['auth'],
    async (refresh: string) => {
      return fetch(`${config.AUTHZ_URL}/auth/renew`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      }).then(async (res) => {
        if (res.status !== 200) {
          throw new Error(`Expired refresh token`)
        }
        return await res
          .json()
          .then((json: { token: string; refresh: string }) => json)
      })
    },
    {}
  )
}
