import { Navigate, useParams } from 'react-router-dom'
import { saveTruck, useTruck } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Truck, TruckForm, zTruckForm } from '../../types/truck'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput } from '../../components/Form'
import { emptyTruck } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

export const TruckEditor = ({ create = false }: { create?: boolean }) => {
  const id = create ? undefined : useParams<{ id: string }>().id

  const { data, isError } = useTruck(id)

  const truck = create ? emptyTruck() : data

  if (isError) return <Header title={'Some error occurred...'} />
  if (!truck) return <Loader className="h-32" />

  const title = create ? `Add new Truck` : `Truck ${truck.id}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <TruckEditorForm truck={truck} create={create} />
    </div>
  )
}

export const TruckEditorForm: FC<{
  truck: TruckForm
  create: boolean
}> = ({ truck, create }) => {
  const [disabled, setDisabled] = useState(Boolean(truck.id))
  const { mutateAsync: save, isLoading, isSuccess } = saveTruck(create)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Truck>({
    resolver: zodResolver(zTruckForm),
    defaultValues: truck,
  })

  if (isSuccess) return <Navigate to="/dashboard/truck" />

  const onSubmit = (t: Truck) => {
    toast.promise(() => save(t), {
      pending: 'Saving truck...',
      success: {
        render() {
          return 'Truck saved!'
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
          title="Identifier: "
          {...register('id')}
          error={errors.id?.message}
          placeholder="e.g: eTruck01"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Tare (kg)"
          {...register('tare', { valueAsNumber: true })}
          error={errors.tare?.message}
          placeholder="Tare"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Max Weight (kg)"
          {...register('maxWeight', { valueAsNumber: true })}
          error={errors.maxWeight?.message}
          placeholder="Max Weight"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Max Charge (kWh)"
          {...register('maxCharge', { valueAsNumber: true })}
          error={errors.maxCharge?.message}
          placeholder="Max Charge"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Range (km)"
          {...register('range', { valueAsNumber: true })}
          error={errors.range?.message}
          placeholder="Range"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Charging Time (min)"
          {...register('chargingTime', { valueAsNumber: true })}
          error={errors.chargingTime?.message}
          placeholder="Charging Time"
          type="number"
          step="1"
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

export default TruckEditor
