import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import PaginatedTable from '../../components/PaginatedTable'
import Button from '../../components/Button'
import { usePaths } from '../../services'
import ErrorMessage from '../../components/ErrorMessage'
import { usePagination } from '../../hooks/pagination'

const PathList = () => {
  const { pagination, onPaginate } = usePagination()
  const { data, isLoading, isError } = usePaths(pagination)

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Paths'} />
      <PaginatedTable
        emptyLabel={'No path found'}
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
            key: 'startWarehouse',
            label: 'From Warehouse',
            sortable: true,
            filterable: true,
            type: 'text',
          },
          {
            key: 'endWarehouse',
            label: 'To Warehouse',
            sortable: true,
            filterable: true,
            type: 'text',
          },
          {
            key: 'time',
            label: 'Time (min)',
            sortable: true,
            filterable: true,
            type: 'number',
          },
          {
            key: 'distance',
            label: 'Distance (km)',
            sortable: true,
            filterable: true,
            type: 'number',
          },
          {
            key: 'batteryConsumption',
            label: 'Battery consumption (kWh)',
            sortable: true,
            filterable: true,
            type: 'number',
          },
        ]}
        pagination={pagination}
        onPaginate={onPaginate}
        totalCount={data.totalCount}
        rows={
          data.paths.map((p) => ({
            cols: [
              p.truckId,
              p.startWarehouse,
              p.endWarehouse,
              String(p.time),
              String(p.distance),
              String(p.batteryConsumption),
            ],
            link: `${p.id}`,
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
          <span>Add path</span>
        </Button>
      </NavLink>
    </div>
  )
}

export default PathList
