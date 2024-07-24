import { Navigate, useParams } from 'react-router-dom'
import { savePath, usePath, useTrucks, useWarehouses } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Path, PathForm, zPathForm } from '../../types/path'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput, SelectInput } from '../../components/Form'
import { emptyPath } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { Warehouse } from '../../types/warehouse'
import { Truck } from '../../types/truck'

export const PathEditor = ({ create = false }: { create?: boolean }) => {
  const code = create ? undefined : useParams<{ id: string }>().id

  const { data, isError } = usePath(code)
  const { data: warehouses, isError: warehouseError } = useWarehouses()
  const { data: trucks, isError: truckError } = useTrucks()

  if (isError || warehouseError || truckError) {
    return <Header title={'Some error occurred...'} />
  }

  if (!warehouses || !trucks) return <Loader className="h-32" />

  if (warehouses.length < 2 || trucks.length < 1) {
    return (
      <Header
        small
        title={'There is no warehouse or truck data to create a path...'}
      />
    )
  }

  const path = create
    ? emptyPath(trucks[0].id, warehouses[0]?.code, warehouses[1]?.code)
    : data

  if (!path) return <Loader className="h-32" />

  const title = create ? `Add new Path` : `Path ${path.id}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <PathFormEditor
        path={path}
        warehouses={warehouses}
        trucks={trucks}
        create={create}
      />
    </div>
  )
}

export const PathFormEditor: FC<{
  path: Path
  warehouses: Warehouse[]
  trucks: Truck[]
  create: boolean
}> = ({ path, create, warehouses, trucks }) => {
  const [disabled, setDisabled] = useState(Boolean(path.id))
  const { mutateAsync: save, isLoading, isSuccess } = savePath(create)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<PathForm>({
    resolver: zodResolver(zPathForm),
    defaultValues: {
      ...path,
    },
  })

  const originWarehouse = watch('startWarehouse')
  const destinationWarehouse = watch('endWarehouse')

  if (isSuccess) return <Navigate to="/dashboard/path" />

  const onSubmit = (w: PathForm) => {
    toast.promise(() => save({ ...w, id: path.id }), {
      pending: 'Saving path...',
      success: {
        render() {
          return 'Path saved!'
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

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <SelectInput
          options={trucks.map((t) => ({ value: t.id, label: t.id }))}
          disabled={disabled || isLoading}
          title="Truck:"
          {...register('truckId')}
          error={errors.truckId?.message}
        />
        <SelectInput
          options={warehouses
            .filter((w) => w.code !== destinationWarehouse)
            .map((t) => ({
              value: t.code,
              label: t.code,
            }))}
          disabled={disabled || isLoading}
          title="Origin:"
          {...register('startWarehouse')}
          error={errors.startWarehouse?.message}
        />
        <SelectInput
          options={warehouses
            .filter((w) => w.code !== originWarehouse)
            .map((t) => ({
              value: t.code,
              label: t.code,
            }))}
          disabled={disabled || isLoading}
          title="Destination:"
          {...register('endWarehouse')}
          error={errors.endWarehouse?.message}
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Distance (km)"
          {...register('distance', { valueAsNumber: true })}
          error={errors.distance?.message}
          placeholder="Distance from origin to destination (km)"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Time (min)"
          {...register('time', { valueAsNumber: true })}
          error={errors.time?.message}
          placeholder="Time to travel with full truck load from origin to
          destionation (min)"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Battery consumption (kWh)"
          {...register('batteryConsumption', { valueAsNumber: true })}
          error={errors.batteryConsumption?.message}
          placeholder="Battery comsumed to travel from origin to destination
          under full truck load"
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

export default PathEditor
