import { FC } from 'react'

const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={`px-6 py-2 rounded-xl bg-red-100 text-sm font-normal
        text-red-600 hover:bg-red-200 hover:text-red-800 shadow-md flex
        items-center gap-1 group transition ml-auto group disabled:bg-slate-200
        disabled:text-slate-600 ${props.className ? props.className : ''}`}
    >
      {props.children}
    </button>
  )
}

export default Button
