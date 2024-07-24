import { Navigate, useParams } from 'react-router-dom'
import { saveUser, useUser } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput, SelectInput } from '../../components/Form'
import { emptyUser } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { roles, User, UserForm, zUserForm } from '../../types/auth'

export const UserEditor = ({ create = false }: { create?: boolean }) => {
  const encodedMail = create ? undefined : useParams<{ mail: string }>().mail

  const mail = encodedMail ? decodeURIComponent(encodedMail) : undefined

  const { data, isError } = useUser(mail)

  const user = create ? emptyUser() : data

  if (isError) return <Header title={'Some error occurred...'} />
  if (!user) return <Loader className="h-32" />

  const title = create ? `Add new User` : `User ${user.mail}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <UserFormPage user={user} create={create} />
    </div>
  )
}

const UserFormPage: FC<{ user: Omit<User, 'status'>; create: boolean }> = ({
  user,
  create,
}) => {
  const [disabled, setDisabled] = useState(Boolean(user.mail))
  const { mutateAsync: save, isLoading, isSuccess } = saveUser(create)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserForm>({
    resolver: zodResolver(zUserForm),
    defaultValues: { ...user, ...(!create && { password: '******' }) },
  })

  if (isSuccess) return <Navigate to="/dashboard/user" />

  const onSubmit = (user: UserForm) => {
    toast.promise(() => save(user), {
      pending: 'Saving user...',
      success: {
        render() {
          return 'User saved!'
        },
      },
      error: {
        render(err) {
          return `${err.data}`
        },
      },
    })
  }

  const onError = (err: typeof errors) => {
    console.log({ err })
    toast.error('Form has invalid inputs')
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextInput
          disabled={disabled || isLoading || !create}
          title="User email"
          {...register('mail')}
          error={errors.mail?.message}
          placeholder="who@am.i"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="User name:"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Smith"
        />
        <>
          {create && (
            <>
              <TextInput
                disabled={disabled || isLoading}
                title="User password:"
                {...register('password')}
                error={errors.password?.message}
                type="password"
                placeholder="*********"
              />
              <TextInput
                disabled={disabled || isLoading}
                title="Phone number:"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                type="text"
                placeholder="e.g: +351-123456789"
              />
            </>
          )}
        </>
        <SelectInput
          options={roles.map((role) => ({ value: role, label: role }))}
          disabled={disabled || isLoading}
          title="Role:"
          {...register('role')}
          error={errors.role?.message}
        />
        <>
          {disabled && (
            <Button type="button" onClick={() => setDisabled(false)}>
              Edit
            </Button>
          )}
          {!disabled && (
            <Button type="submit" disabled={!isDirty || isLoading}>
              Submit
            </Button>
          )}
        </>
      </Form>
    </>
  )
}

export default UserEditor
