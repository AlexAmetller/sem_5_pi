import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PersonIcon from '@mui/icons-material/Person'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import TodayIcon from '@mui/icons-material/Today'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import RouteIcon from '@mui/icons-material/Route'
import MapIcon from '@mui/icons-material/Map'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import BackpackIcon from '@mui/icons-material/Backpack'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { DrawerData } from '../interfaces'
import { User } from '../types/auth'

const warehouseLink = {
  url: '/dashboard/warehouse',
  icon: <WarehouseIcon fontSize="small" />,
  title: 'Warehouses',
  disabled: false,
}
const truckLink = {
  url: '/dashboard/truck',
  icon: <LocalShippingIcon fontSize="small" />,
  title: 'Trucks',
  disabled: false,
}
const deliveryLink = {
  url: '/dashboard/delivery',
  icon: <TodayIcon fontSize="small" />,
  title: 'Deliveries',
  disabled: false,
}
const pathLink = {
  url: '/dashboard/path',
  icon: <RouteIcon fontSize="small" />,
  title: 'Paths',
  disabled: false,
}
const packagingLink = {
  url: '/dashboard/packaging',
  icon: <BackpackIcon fontSize="small" />,
  title: 'Packagings',
  disabled: false,
}
const dataHeader = {
  title: 'Data management',
  icon: <ModeEditIcon fontSize="small" />,
}

const scheduleHeader = {
  title: 'Delivery planning',
  icon: <MapIcon fontSize="small" />,
}

const scheduleLink = {
  url: '/dashboard/schedule',
  icon: <EventRepeatIcon fontSize="small" />,
  title: 'Delivery planning',
  disabled: false,
}

const userHeader = {
  title: 'User management',
  icon: <ManageAccountsIcon fontSize="small" />,
}

const userLink = {
  url: '/dashboard/user',
  icon: <PersonIcon fontSize="small" />,
  title: 'Registered Users',
  disabled: false,
}

const settingsHeader = {
  title: 'User settings',
  icon: <SettingsIcon fontSize="small" />,
}

const accountLink = {
  url: '/dashboard/account',
  icon: <ManageAccountsIcon fontSize="small" />,
  title: 'Account',
  disabled: false,
}

const logoutLink = {
  url: '/logout',
  icon: <LogoutIcon fontSize="small" />,
  title: 'Logout',
  disabled: false,
}

const roleMap: { [x in User['role']]: DrawerData[] } = {
  admin: [
    {
      header: userHeader,
      links: [userLink],
    },
  ],
  'warehouse-manager': [
    {
      header: dataHeader,
      links: [warehouseLink, deliveryLink],
    },
  ],
  'logistics-manager': [
    {
      header: dataHeader,
      links: [pathLink, packagingLink],
    },
    {
      header: scheduleHeader,
      links: [scheduleLink],
    },
  ],
  'fleet-manager': [
    {
      header: dataHeader,
      links: [truckLink],
    },
  ],
}

const drawer = (role: User['role']): DrawerData[] => {
  return [
    ...roleMap[role],
    {
      header: settingsHeader,
      links: [accountLink, logoutLink],
    },
  ]
}

export default {
  drawer,
}
