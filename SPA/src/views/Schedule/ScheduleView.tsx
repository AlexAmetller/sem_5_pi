import { useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Table from '../../components/Table'
import { useSchedule } from '../../services'

const ScheduleView = () => {
  const { id } = useParams<{ id: string }>()

  const { data: schedule, isError } = useSchedule(id)

  if (isError) return <Header title={'Some error occurred...'} />
  if (!schedule) return <Loader className="h-32" />

  const totalMass = schedule.deliveries.reduce(
    (sum, delivery) => sum + delivery.mass,
    0
  )

  return (
    <div className="flex flex-col">
      <Header title={`Delivery plan information`} />
      <Table
        numbered={false}
        cols={[
          'Origin warehouse',
          'Delivery time',
          'Delivery date',
          'Total mass (kg)',
        ]}
        rows={[
          {
            cols: [
              `${schedule.originWarehouse.description} (${schedule.originWarehouse.code})`,
              `${schedule.totalTime.toFixed(0)} minutes`,
              schedule.date.toISOString().slice(0, 10),
              String(totalMass),
            ],
          },
        ]}
      />
      <Header small title="Delivery order" />
      <Table
        cols={['Code', 'Description', 'Mass (kg)']}
        rows={
          schedule.deliveries.map((delivery) => ({
            cols: [
              delivery.code,
              delivery.destinationWarehouseCode,
              String(delivery.mass),
            ],
            link: `/dashboard/delivery/${delivery.code}`,
          })) ?? []
        }
      />
    </div>
  )
}

export default ScheduleView
