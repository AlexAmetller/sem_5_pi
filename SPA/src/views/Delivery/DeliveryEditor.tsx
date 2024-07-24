import { Navigate, useParams } from 'react-router-dom'
import { saveDelivery, useDelivery, useWarehouses } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Delivery, zDelivery } from '../../types/delivery'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput, DateInput, SelectInput } from '../../components/Form'
import { emptyDelivery } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { Warehouse } from '../../types/warehouse'

export const DeliveryEditor = ({
  create = false,
  locked = false,
}: {
  create?: boolean
  locked?: boolean
}) => {
  const code = create ? undefined : useParams<{ code: string }>().code

  const { data, isError } = useDelivery(code)
  const { data: warehouses, isError: warehouseError } = useWarehouses()

  if (isError || warehouseError) {
    return <Header title={'Some error occurred...'} />
  }

  if (!warehouses) return <Loader className="h-32" />

  if (warehouses.length === 0) {
    return (
      <Header
        small
        title={'There is no warehouse data to create a delivery...'}
      />
    )
  }

  const delivery = create ? emptyDelivery(warehouses[0]?.code) : data

  if (!delivery) return <Loader className="h-32" />

  const title = create ? `Add new Delivery` : `Delivery ${delivery.code}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <DeliveryForm
        delivery={delivery}
        warehouses={warehouses}
        create={create}
        locked={locked}
      />
    </div>
  )
}

export const DeliveryForm: FC<{
  delivery: Delivery
  warehouses: Warehouse[]
  create: boolean
  locked: boolean
}> = ({ delivery, create, warehouses, locked }) => {
  const [disabled, setDisabled] = useState(Boolean(delivery.code))
  const { mutateAsync: save, isLoading, isSuccess } = saveDelivery(create)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Delivery>({
    resolver: zodResolver(zDelivery),
    defaultValues: delivery,
  })

  if (isSuccess) return <Navigate to="/dashboard/delivery" />

  const onSubmit = (w: Delivery) => {
    toast.promise(() => save(w), {
      pending: 'Saving delivery...',
      success: {
        render() {
          return 'Delivery saved!'
        },
      },
      error: {
        render(err) {
          console.log({ err })
          return `${err.data}`
        },
      },
    })
  }

  const onError = (err: typeof errors) => {
    console.log({ err })
    toast.error('Form has invalid inputs')
  }

  console.log({ locked })

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <TextInput
          disabled={disabled || isLoading || !create}
          title="Code:"
          {...register('code')}
          error={errors.code?.message}
          placeholder="Four digit code (4442)"
        />
        <SelectInput
          disabled={disabled || isLoading}
          options={warehouses.map((t) => ({
            value: t.code,
            label: t.code,
          }))}
          title="Origin warehouse:"
          {...register('destinationWarehouseCode')}
          error={errors.destinationWarehouseCode?.message}
        />
        <DateInput
          disabled={disabled || isLoading}
          title="Date:"
          {...register('date')}
          error={errors.date?.message}
          placeholder="Date of delivery"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Mass"
          {...register('mass', { valueAsNumber: true })}
          error={errors.mass?.message}
          placeholder="Mass of delivery"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Loading Time"
          {...register('loadingTime', { valueAsNumber: true })}
          error={errors.loadingTime?.message}
          placeholder="Loading Time"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Withdrawing Time"
          {...register('withdrawingTime', { valueAsNumber: true })}
          error={errors.withdrawingTime?.message}
          placeholder="Withdrawing Time"
          type="number"
          step="1"
        />
        <>
          {disabled && !locked && (
            <Button type="button" onClick={() => setDisabled(false)}>
              Edit
            </Button>
          )}
          {!disabled && !locked && (
            <Button type="submit" disabled={!isDirty || isLoading}>
              Submit
            </Button>
          )}
        </>
      </Form>
    </>
  )
}

export default DeliveryEditor
