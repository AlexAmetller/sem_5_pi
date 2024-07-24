import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import useAuth from '../hooks/auth'

export default function Account() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />

  return (
    <div>
      <Header title={`User account`} />
      <div className="mt-12">
        <Item label="User name:" value={user.name} />
        <Item label="User mail:" value={user.mail} />
        <Item label="User role:" value={user.role} />
      </div>
    </div>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex mt-4">
      <div className={`font-semibold text-slate-700 text-md w-20`}>{label}</div>
      <div className={`ml-4 text-slate-500`}>{value}</div>
    </div>
  )
}
