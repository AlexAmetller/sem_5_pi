import { useEffect } from 'react'
import Loader from '../components/Loader'
import useAuth from '../hooks/auth'

export default function Logout() {
  const { logout } = useAuth()
  useEffect(() => {
    logout()
  }, [])
  return (
    <div className="w-screen h-screen">
      <Loader />
    </div>
  )
}
