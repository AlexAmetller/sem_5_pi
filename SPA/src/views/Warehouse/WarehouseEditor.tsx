import { Navigate, useParams } from 'react-router-dom'
import { saveWarehouse, useWarehouse } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Warehouse, zWarehouse } from '../../types/warehouse'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput, TextareaInput } from '../../components/Form'
import { emptyWarehouse } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

export const WarehouseEditor = ({ create = false }: { create?: boolean }) => {
  const code = create ? undefined : useParams<{ code: string }>().code

  const { data, isError } = useWarehouse(code)

  const warehouse = create ? emptyWarehouse() : data

  if (isError) return <Header title={'Some error occurred...'} />
  if (!warehouse) return <Loader className="h-32" />

  const title = create ? `Add new Warehouse` : `Warehouse ${warehouse.code}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <WarehouseForm warehouse={warehouse} create={create} />
    </div>
  )
}

const WarehouseForm: FC<{ warehouse: Warehouse; create: boolean }> = ({
  warehouse,
  create,
}) => {
  const [disabled, setDisabled] = useState(Boolean(warehouse.code))
  const { mutateAsync: save, isLoading, isSuccess } = saveWarehouse(create)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Warehouse>({
    resolver: zodResolver(zWarehouse),
    defaultValues: warehouse,
  })

  if (isSuccess) return <Navigate to="/dashboard/warehouse" />

  const onSubmit = (w: Warehouse) => {
    toast.promise(() => save(w), {
      pending: 'Saving warehouse...',
      success: {
        render() {
          return 'Warehouse saved!'
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
          title="Code:"
          {...register('code')}
          error={errors.code?.message}
          placeholder="Three digit code (ABC)"
        />
        <TextareaInput
          disabled={disabled || isLoading}
          title="Description:"
          {...register('description')}
          error={errors.description?.message}
          placeholder="Location description"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Street"
          {...register('address.street')}
          error={errors.address?.street?.message}
          placeholder="Address street"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Postal code"
          {...register('address.postalCode')}
          error={errors.address?.postalCode?.message}
          placeholder="Address postcal code"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="City"
          {...register('address.city')}
          error={errors.address?.city?.message}
          placeholder="Address city"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Country"
          {...register('address.country')}
          error={errors.address?.country?.message}
          placeholder="Address country"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Latitude"
          {...register('coordinates.latitude', { valueAsNumber: true })}
          error={errors.coordinates?.latitude?.message}
          placeholder="Coordinates latitude"
          type="number"
          step="0.000001"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Longitude"
          {...register('coordinates.longitude', { valueAsNumber: true })}
          error={errors.coordinates?.longitude?.message}
          placeholder="Coordinates longitude"
          type="number"
          step="0.000001"
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

export default WarehouseEditor
