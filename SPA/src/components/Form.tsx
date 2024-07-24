import React from 'react'
import { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

const inputStyle = `
  flex-grow rounded-md
  px-4 py-2
  border-1
  border-slate-200
  shadow-md
  shadow-slate-300
  bg-white
  focus:outline-none
  focus:shadow-md
  focus:
  focus:ring-2
  ring-0
  ring-sky-800
  disabled:bg-slate-200`

interface IInput extends UseFormRegisterReturn<string> {
  title?: string
  placeholder?: string
  error?: string
}

const Form: FC<{
  onSubmit: (
    e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => Promise<void>
  children: JSX.Element | JSX.Element[]
  className?: string
}> = ({ onSubmit, children, className = '' }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`w-full flex flex-col lg:bg-slate-50 bg-slate-100 rounded-xl
        p-6 gap-6 shadow-md lg:shadow-none font-thin ${className}`}
    >
      {children}
    </form>
  )
}

const InputWrapper: FC<{
  children: JSX.Element
  title?: string
  error?: string
}> = ({ children, title, error }) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        {title && <span className="w-32 py-[10px]">{title}</span>}
        {children}
      </div>
      {error && (
        <div className="pl-32 py-2 text-red-500 font-thin">{error}</div>
      )}
    </div>
  )
}

const TextInput = React.forwardRef<
  HTMLInputElement,
  IInput & { type?: string; step?: string }
>((props, ref) => {
  return (
    <InputWrapper title={props.title} error={props.error}>
      <input
        className={inputStyle}
        placeholder={props.placeholder}
        {...props}
        ref={ref}
        type={props.type ?? 'text'}
      />
    </InputWrapper>
  )
})

const TextareaInput = React.forwardRef<HTMLTextAreaElement, IInput>(
  (props, ref) => {
    return (
      <InputWrapper title={props.title} error={props.error}>
        <textarea
          className={`${inputStyle} h-32`}
          placeholder={props.placeholder}
          {...props}
          ref={ref}
        />
      </InputWrapper>
    )
  }
)

const DateInput = React.forwardRef<HTMLInputElement, Partial<IInput>>(
  (props, ref) => {
    return (
      <InputWrapper title={props.title ?? ''} error={props.error}>
        <input
          type="date"
          className={`${inputStyle}`}
          placeholder={props.placeholder}
          {...props}
          ref={ref}
        />
      </InputWrapper>
    )
  }
)

const SelectInput = React.forwardRef<
  HTMLSelectElement,
  IInput & {
    options: Array<{ value: string; label: string; selected?: boolean }>
    value?: string
  }
>((props, ref) => {
  return (
    <InputWrapper title={props.title} error={props.error}>
      <select {...props} className={`${inputStyle} `} ref={ref}>
        {props.options.map((option, index) => (
          <option key={index} value={option.value} selected={option.selected}>
            {option.label}
          </option>
        ))}
      </select>
    </InputWrapper>
  )
})

export { TextInput, TextareaInput, SelectInput, DateInput }
export default Form
