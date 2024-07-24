import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import Toaster from '../components/Toaster'
import Home from './Home'
import Drawer from '../components/Drawer'
import Navbar from '../components/Navbar'
import Login from './Login'
import WarehouseEditor from './Warehouse/WarehouseEditor'
import WarehouseList from './Warehouse/WarehouseList'
import TruckEditor from './Truck/TruckEditor'
import TruckList from './Truck/TruckList'
import DeliveryEditor from './Delivery/DeliveryEditor'
import DeliveryList from './Delivery/DeliveryList'
import PackagingEditor from './Packaging/PackagingEditor'
import PackagingList from './Packaging/PackagingList'
import ScheduleEditor from './Schedule/ScheduleEditor'
import ScheduleList from './Schedule/ScheduleList'
import ScheduleView from './Schedule/ScheduleView'
import UserList from './User/UserList'
import UserEditor from './User/UserEditor'
import PathEditor from './Path/PathEditor'
import PathList from './Path/PathList'
import Account from './Account'
import Logout from './Logout'
import { User } from '../types/auth'
import { queryClient } from '../services'
import settings from '../utils/settings'
import useAuth from '../hooks/auth'
import config from '../utils/config'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Routes>
            <Route path="dashboard/*" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" />

  return (
    <AppLayout role={user.role}>
      <Routes>
        {user.role === 'admin' && (
          <Route path="user">
            <Route index element={<UserList />} />
            <Route path="new" element={<UserEditor create />} />
            <Route path=":mail" element={<UserEditor />} />
          </Route>
        )}
        {user.role === 'warehouse-manager' && (
          <>
            <Route path="warehouse">
              <Route index element={<WarehouseList />} />
              <Route path="new" element={<WarehouseEditor create />} />
              <Route path=":code" element={<WarehouseEditor />} />
            </Route>
            <Route path="delivery">
              <Route index element={<DeliveryList />} />
              <Route path="new" element={<DeliveryEditor create />} />
              <Route path=":code" element={<DeliveryEditor />} />
            </Route>
          </>
        )}
        {user.role === 'logistics-manager' && (
          <>
            <Route path="path">
              <Route index element={<PathList />} />
              <Route path="new" element={<PathEditor create />} />
              <Route path=":id" element={<PathEditor />} />
            </Route>
            <Route path="packaging">
              <Route index element={<PackagingList />} />
              <Route path="new" element={<PackagingEditor create />} />
              <Route path=":id" element={<PackagingEditor />} />
            </Route>
            <Route path="schedule">
              <Route index element={<ScheduleList />} />
              <Route path="new" element={<ScheduleEditor />} />
              <Route path=":id" element={<ScheduleView />} />
            </Route>
            <Route path="delivery">
              <Route index element={<DeliveryList />} />
              <Route path=":code" element={<DeliveryEditor locked={true} />} />
            </Route>
          </>
        )}
        {user.role === 'fleet-manager' && (
          <Route path="truck">
            <Route index element={<TruckList />} />
            <Route path="new" element={<TruckEditor create />} />
            <Route path=":id" element={<TruckEditor />} />
          </Route>
        )}
        <Route path="account" element={<Account />} />
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

const AppLayout = ({
  role,
  children,
}: {
  role: User['role']
  children?: React.ReactNode
}) => {
  return (
    <div className="flex xl:container w-full mx-auto">
      <Drawer entries={settings.drawer(role)} />
      <div className="w-full p-6 flex flex-col">
        <Navbar />
        <div className="w-full relative flex flex-col">{children}</div>
      </div>
    </div>
  )
}

export default App
