import { useAppStore } from '../hooks/store'
import HomeIcon from '@mui/icons-material/Home'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw'
import { NavLink, useLocation } from 'react-router-dom'

const Navbar = () => {
  const openDrawer = useAppStore((state) => state.openDrawer)
  const location = useLocation()
  const paths = getPaths(decodeURIComponent(location.pathname))
  return (
    <div className="w-full bg-slate-100 lg:bg-slate-50 rounded-xl p-4 mt-1 flex mb-8 shadow-md lg:shadow-none lg:px-0">
      <div className="flex flex-wrap">
        <div className="lg:hidden flex flex-nowrap flex-shrink-0 mr-6">
          <NavLink
            to="/dashboard"
            onClick={close}
            className={`text-sky-900 flex items-center  gap-x-3`}
          >
            <ElectricRickshawIcon fontSize="medium" />
            <span className="font-medium">ElectricGO</span>
          </NavLink>
        </div>
        <div className="flex items-center">
          <div className="text-sky-900 mr-1 scale-90">
            <HomeIcon fontSize="small" />
          </div>
          <div className="block">
            {paths.urls.map((p, idx) => (
              <NavLink key={`${idx}-${p.url}`} to={p.url}>
                <span className="text-slate-400">{' / ' + p.text}</span>
              </NavLink>
            ))}
            &nbsp;
            <span>{' / ' + paths.last}</span>
          </div>
        </div>
      </div>
      <div className="ml-auto pl-3 lg:hidden hover:scale-125">
        <button onClick={openDrawer}>
          <MenuOpenIcon />
        </button>
      </div>
    </div>
  )
}

const getPaths = (
  pathname: string
): { last: string; urls: Array<{ text: string; url: string }> } => {
  const urls = [...pathname.matchAll(/[^/]+/g)].map((match) => ({
    text: match[0],
    url: pathname.slice(0, match.index) + match[0],
  }))
  if (urls.length === 0) return { last: '', urls: [] }
  const last = urls.pop()?.text ?? ''
  return { last, urls }
}

export default Navbar
