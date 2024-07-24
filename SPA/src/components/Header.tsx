import { FC } from 'react'

const Header: FC<{ title: string; small?: boolean }> = ({
  title,
  small = false,
}) => {
  return (
    <div className={`mb-3 my-3 font-semibold ${small ? 'text-md' : 'text-xl'}`}>
      {title}
    </div>
  )
}

export default Header
