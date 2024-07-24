import { FC } from 'react'
import { useAppStore } from '../hooks/store'
import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw'
import { DrawerData } from '../interfaces'

const Drawer: FC<{ entries: DrawerData[] }> = ({ entries }) => {
  const close = useAppStore((state) => state.closeDrawer)
  const isOpen = useAppStore((state) => state.showDrawer)
  return (
    <div
      className={`w-full lg:w-72 absolute lg:block lg:relative
        lg:transition-none lg:translate-x-0 ${isOpen ? '' : '-translate-x-full'}
        transition ease-in-out delay-150 p-4 lg:p-0 h-screen z-10 backdrop-blur
        flex`}
    >
      <div
        className={`w-72 bg-white lg:bg-slate-50 rounded-2xl flex-shrink-0 p-6 relative
          lg:m-0 h-full drop-shadow-lg lg:drop-shadow-none flex flex-col
          items-center overflow-y-auto overflow-x-hidden`}
      >
        <Header close={close} />
        <CloseButton close={close} />
        {entries.map((entry, index) => (
          <LinkGroup
            key={`${index}-entry.header.title`}
            close={close}
            entry={entry}
          />
        ))}
      </div>
      <div
        id="backdrop"
        className="transparent lg:hidden w-full h-full flex-shrink"
        onClick={close}
      ></div>
    </div>
  )
}

const Header: FC<{
  close: () => void
}> = ({ close }) => {
  return (
    <>
      <div className="flex w-full flex-col items-center my-3">
        <NavLink
          to="/dashboard"
          onClick={close}
          className={`flex items-center py-1 px-4 w-full justify-between text-sky-900`}
        >
          <ElectricRickshawIcon fontSize="large" />
          <span className="font-medium">ElectricGO Dashboard</span>
        </NavLink>
      </div>
      <div
        className={`h-px mb-3 bg-slate-600 transparent w-5/6 bg-gradient-radial
          to-slate-50 from-slate-200`}
      >
        &nbsp;
      </div>
    </>
  )
}

const CloseButton: FC<{
  close: () => void
}> = ({ close }) => {
  return (
    <div
      className={`absolute right-4 top-4 block lg:hidden transition
        hover:scale-125 text-sky-900`}
    >
      <button onClick={close}>
        <CloseIcon fontSize="small" />
      </button>
    </div>
  )
}

const LinkGroup: FC<{
  close: () => void
  entry: DrawerData
}> = ({ close, entry }) => {
  return (
    <div className="w-full m-2">
      <div
        className="flex gap-x-6 w-full py-3 px-4 mb-4 rounded-xl
          drop-shadow-none
          lg:bg-slate-50 items-center"
      >
        <div
          className={`rounded-lg drop-shadow-md p-1 w-8 h-8 flex items-center
            justify-center text-white bg-gradient-to-br from-purple-500
            to-red-500`}
        >
          <span>{entry.header.icon}</span>
        </div>
        <span className="font-semibold">{entry.header.title}</span>
      </div>
      <ul className={`flex gap-x-6 w-full px-2 flex-col gap-y-2`}>
        {entry.links.map((link, index) => (
          <li className="w-full" key={`${index}-link.title`}>
            <NavLink
              to={link.url}
              onClick={close}
              className={({ isActive }) => `
                font-normal text-slate-500 flex gap-x-7 items-center group
                transition duration-75 hover:bg-red-50 hover:text-slate-700 px-4
                py-2 rounded-xl hover:scale-110 hover:shadow-md focus:bg-red-100
                focus:shadow-md active:bg-red-200 active:shadow-md
                ${isActive ? 'bg-red-100 shadow-md' : ''}
                ${link.disabled ? 'pointer-events-none' : ''}
                ${link.disabled ? 'opacity-50' : ''}
                `}
            >
              <div
                className={`rounded-lg drop-shadow-md bg-stone-100
                  group-hover:bg-stone-50  w-8 h-8 flex items-center
                  justify-center text-sky-900`}
              >
                {link.icon}
              </div>
              <span>{link.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Drawer
