import { zUser } from '../types/auth'
import jwt_decode from 'jwt-decode'

export const getCookies = () => {
  const cookies = new Map<string, string>()
  document.cookie.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=')
    if (key && value && key !== '' && value !== '') {
      cookies.set(key.trim(), value.trim())
    }
  })
  return cookies
}

export const parseToken = (token: string) => {
  const decoded = jwt_decode(token)
  const result = zUser.safeParse(decoded)
  if (result.success) {
    return result.data
  }
  return undefined
}

export const getUser = () => {
  const { token } = getToken()
  return token ? parseToken(token) : undefined
}

export const getToken = () => {
  const cookies = getCookies()
  const token = cookies.get('access_token')
  const refresh = cookies.get('refresh_token')
  return { token, refresh }
}

export const storeToken = (token: string, refresh: string) => {
  const user = parseToken(token)
  if (!user) {
    console.error(`Failed parsing user from token.`)
    return null
  }
  clearToken()
  const domain = window.location.hostname
  document.cookie = `access_token=${token}; path=/; domain=${domain}; secure`
  document.cookie = `refresh_token=${refresh}; path=/; domain=${domain}; secure`
  return user
}

export const clearToken = () => {
  const domain = window.location.hostname
  document.cookie = `access_token=; path=/; domain=${domain}; max-age=0`
  document.cookie = `refresh_token=; path=/; domain=${domain}; max-age=0`
}

export const getExpDate = (token?: string) => {
  if (!token) return 'unknown'
  const decoded = jwt_decode(token) as { exp: string }
  const date = new Date(0)
  date.setUTCSeconds(Number(decoded.exp))
  return date.toLocaleString()
}

export const makeHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken().token}`,
})
