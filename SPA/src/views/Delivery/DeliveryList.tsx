import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { useDeliveries } from '../../services'
import ErrorMessage from '../../components/ErrorMessage'

const DeliveryList = () => {
  const { data, isLoading, isError } = useDeliveries()

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Deliverys'} />
      <Table
        emptyLabel="No delivery found"
        cols={['Code', 'Warehouse', 'Date', 'Mass (kg)']}
        rows={
          data
            ?.slice()
            .reverse()
            .map((d) => ({
              cols: [
                d.code,
                d.destinationWarehouseCode,
                d.date.toISOString().slice(0, 10),
                String(d.mass),
              ],
              link: `${d.code}`,
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
          <span>Add delivery</span>
        </Button>
      </NavLink>
    </div>
  )
}

export default DeliveryList
