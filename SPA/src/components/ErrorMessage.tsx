import { FC } from 'react'

const ErrorMessage: FC<{ message?: string; className?: string }> = ({
  message,
  className,
}) => {
  const defaultMessage = 'Some error occurred'
  return (
    <div className={`h-1/2 w-full flex justify-center ${className}`}>
      <span>{message ?? defaultMessage}</span>
    </div>
  )
}

export default ErrorMessage
