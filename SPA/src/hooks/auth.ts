import { toast } from 'react-toastify'
import { useAppStore } from '../hooks/store'
import { useRenewToken } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken, storeToken } from '../utils/auth'

const useAuth = () => {
  const navigate = useNavigate()
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const { mutateAsync: renew } = useRenewToken()

  const logout = () => {
    clearToken()
    setUser(undefined)
    toast.info('Session terminated.')
    navigate('/login', { replace: true })
  }

  const setToken = (token: string, refresh: string) => {
    const user = storeToken(token, refresh)
    if (!user) return logout()
    setUser(user)
  }

  const renewToken = async () => {
    const { refresh } = getToken()
    if (!refresh) return logout()
    return renew(refresh)
      .then(({ token, refresh }) => {
        return setToken(token, refresh)
      })
      .catch(() => logout())
  }

  return {
    setToken,
    logout,
    renewToken,
    user: user,
  }
}
export default useAuth
