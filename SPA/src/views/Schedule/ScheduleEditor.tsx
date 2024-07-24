import { Navigate } from 'react-router-dom'
import { saveSchedule } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Warehouse } from '../../types/warehouse'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import { DateInput, SelectInput } from '../../components/Form'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { ScheduleForm, zScheduleForm } from '../../types/schedule'
import { Truck } from '../../types/truck'
import { Delivery } from '../../types/delivery'
import { useData } from '../../hooks/data'
import Form from '../../components/Form'
import Table from '../../components/Table'

export const ScheduleEditor = () => {
  const { loading, error, data } = useData()

  if (error) return <Header title={'Some error occurred...'} />
  if (!data || loading) return <Loader className="h-32" />

  if (data.trucks.length === 0 || data.warehouses.length === 0) {
    return (
      <Header
        small
        title={'There is not enough data to create a delivery schedule...'}
      />
    )
  }

  return (
    <div className="flex flex-col">
      <Header title={`Generate delivery schedule`} />
      <DeliveryScheduleForm data={data} />
    </div>
  )
}

const DeliveryScheduleForm: FC<{
  data: {
    trucks: Truck[]
    warehouses: Warehouse[]
    deliveries: Delivery[]
  }
}> = ({ data }) => {
  const {
    mutateAsync: save,
    isLoading,
    isSuccess,
    data: schedule,
  } = saveSchedule()

  const [date, setDate] = useState<Date | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(zScheduleForm),
    defaultValues: {
      deliveryIds: [],
      originWarehouseId: data.warehouses[0]?.code,
      truckId: data.trucks[0]?.id,
    },
  })

  const selectedDeliveries = watch('deliveryIds')

  const clearDeliveries = () => {
    setValue('deliveryIds', [])
  }

  const toggleDelivery = (delivery: Delivery) => {
    if (selectedDeliveries.includes(delivery.code)) {
      return setValue(
        'deliveryIds',
        selectedDeliveries.filter((code) => code !== delivery.code)
      )
    }
    setValue('deliveryIds', [...selectedDeliveries, delivery.code])
  }

  const onSubmit = (form: ScheduleForm) => {
    toast.promise(() => save(form), {
      pending: 'Generating delivery schedule...',
      success: {
        render() {
          return 'Delivery schedule saved!'
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

  if (isSuccess) return <Navigate to={`/dashboard/schedule/${schedule.id}`} />

  const tableList =
    date === undefined
      ? data.deliveries
      : data.deliveries.filter(
          (delivery) => delivery.date.getDate() === date.getDate()
        )

  const deliveryErrors = errors.deliveryIds?.message

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <SelectInput
          options={data.trucks.map((t) => ({ value: t.id, label: t.id }))}
          disabled={isLoading}
          title="Delivery truck:"
          {...register('truckId')}
          error={errors.truckId?.message}
        />
        <SelectInput
          options={data.warehouses.map((t) => ({
            value: t.code,
            label: t.code,
          }))}
          disabled={isLoading}
          title="Origin warehouse:"
          {...register('originWarehouseId')}
          error={errors.originWarehouseId?.message}
        />
        <DateInput
          title="Delivery date:"
          disabled={isLoading}
          onChange={(event) => {
            const value = event.target.value
            const date = value === '' ? undefined : new Date(value)
            setDate((oldDate) => {
              if (date?.getDay() !== oldDate?.getDay()) clearDeliveries()
              return date
            })
            return Promise.resolve(true)
          }}
        />
        <div>
          <span>Select deliveries to include on the schedule plan:</span>
          <Table
            emptyLabel={
              date
                ? `No delivery found for ${date.toISOString().slice(0, 10)}`
                : `No deliveries found.`
            }
            cols={['Delivery', 'Code', 'Date', 'Warehouse', 'Mass (kg)']}
            numbered={false}
            rows={
              tableList.map((delivery) => ({
                cols: [
                  <CheckBox
                    checked={selectedDeliveries.includes(delivery.code)}
                    disabled={date === undefined || isLoading}
                  />,
                  delivery.code,
                  delivery.date.toISOString().slice(0, 10),
                  delivery.destinationWarehouseCode,
                  String(delivery.mass),
                ],
                onClick: () => toggleDelivery(delivery),
                disabled: date === undefined || isLoading,
              })) ?? []
            }
          />
        </div>
        <>
          {deliveryErrors && (
            <div className="w-full flex justify-center py-2 text-red-500 font-thin">
              {deliveryErrors}
            </div>
          )}
        </>
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </Form>
    </>
  )
}

const CheckBox = ({
  checked,
  disabled,
}: {
  checked: boolean
  disabled: boolean
}) => {
  return (
    <div className="flex items-center content-center justify-start w-full h-full ml-5">
      <label>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="cursor-pointer"
        />
      </label>
    </div>
  )
}

export default ScheduleEditor
