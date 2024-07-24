import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import { usePackagings } from '../../services'
import ErrorMessage from '../../components/ErrorMessage'
import { usePagination } from '../../hooks/pagination'
import PaginatedTable from '../../components/PaginatedTable'

const PackagingList = () => {
  const { pagination, onPaginate } = usePagination()
  const { data, isLoading, isError } = usePackagings(pagination)

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Packagings'} />
      <PaginatedTable
        emptyLabel="No packaging found"
        numbered={true}
        cols={[
          {
            key: 'deliveryId',
            label: 'Delivery Id',
            sortable: true,
            filterable: true,
            type: 'text',
          },
          {
            key: 'xposition',
            label: 'Position X',
            sortable: true,
            filterable: false,
            type: 'number',
          },
          {
            key: 'yposition',
            label: 'Position Y',
            sortable: true,
            filterable: false,
            type: 'number',
          },
          {
            key: 'zposition',
            label: 'Position Z',
            sortable: true,
            filterable: false,
            type: 'number',
          },
          {
            key: 'loadingTime',
            label: 'Loading Time',
            sortable: true,
            filterable: true,
            type: 'number',
          },
          {
            key: 'withdrawingTime',
            label: 'Withdrawing Time',
            sortable: true,
            filterable: true,
            type: 'number',
          },
        ]}
        pagination={pagination}
        onPaginate={onPaginate}
        totalCount={data.totalCount}
        rows={
          data.packagings.map((p) => ({
            cols: [
              p.deliveryId,
              String(p.xposition),
              String(p.yposition),
              String(p.zposition),
              String(p.loadingTime),
              String(p.withdrawingTime),
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
          <span>Add packaging</span>
        </Button>
      </NavLink>
    </div>
  )
}

export default PackagingList
