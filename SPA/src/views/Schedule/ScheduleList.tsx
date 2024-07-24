import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import { useSchedules } from '../../services'
import ErrorMessage from '../../components/ErrorMessage'
import { usePagination } from '../../hooks/pagination'
import PaginatedTable from '../../components/PaginatedTable'

const ScheduleList = () => {
  const { pagination, onPaginate } = usePagination()
  const { data, isLoading, isError } = useSchedules(pagination)

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Delivery schedules'} />
      <PaginatedTable
        emptyLabel="No delivery schedule found"
        numbered={true}
        cols={[
          {
            key: 'truckId',
            label: 'Truck',
            sortable: true,
            filterable: true,
            type: 'text',
          },
          {
            key: 'originWarehouseId',
            label: 'Origin',
            sortable: true,
            filterable: true,
            type: 'text',
          },
          {
            key: 'totalTime',
            label: 'Time (min)',
            sortable: true,
            filterable: true,
            type: 'number',
          },
          {
            key: 'deliveries',
            label: 'Deliveries',
            sortable: false,
            filterable: false,
            type: 'text',
          },
          {
            key: 'date',
            label: 'Date',
            sortable: true,
            filterable: true,
            type: 'date',
          },
        ]}
        pagination={pagination}
        onPaginate={onPaginate}
        totalCount={data.totalCount}
        rows={
          data.schedules.map((s) => ({
            cols: [
              s.truck.id,
              s.originWarehouse.code,
              s.totalTime.toFixed(),
              s.deliveries.map((d) => d.code).join(', '),
              s.date.toISOString().slice(0, 10),
            ],
            link: `${s.id}`,
          })) ?? []
        }
      />
    </>
  )
}

const AddButton = () => {
  return (
    <div className="absolute top-2 right-0">
      <NavLink to="new">
        <Button type="button">
          <AddIcon
            className="group-hover:rotate-90 group-hover:transition
              group-hover:duration-500"
          />
          <span>Create delivery schedule</span>
        </Button>
      </NavLink>
    </div>
  )
}

export default ScheduleList
