import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { useWarehouses, saveWarehouse } from '../../services'
import ErrorMessage from '../../components/ErrorMessage'
import { toast } from 'react-toastify'
import { Warehouse } from '../../types/warehouse'

const WarehouseList = () => {
  const { data, isLoading, isError } = useWarehouses()

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Warehouses'} />
      <Table
        emptyLabel="No warehouse found"
        cols={['Code', 'Description', 'Status']}
        rows={
          data
            ?.slice()
            .reverse()
            .map((w) => ({
              cols: [w.code, w.description, <ToggleButton warehouse={w} />],
              link: `${w.code}`,
              disabled: !w.enabled,
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
          <span>Add warehouse</span>
        </Button>
      </NavLink>
    </div>
  )
}

const ToggleButton = ({ warehouse }: { warehouse: Warehouse }) => {
  const { mutateAsync } = saveWarehouse(false)
  console.log({ warehouse })
  const onClick = () => {
    toast.promise(
      () => mutateAsync({ ...warehouse, enabled: !warehouse.enabled }),
      {
        pending: 'Inhibiting warehouse...',
        success: {
          render() {
            return `Warehouse ${warehouse.enabled ? 'inhibited!' : 'enabled!'}`
          },
        },
        error: {
          render(err) {
            return `${err.data}`
          },
        },
      }
    )
  }
  return (
    <Button
      type="button"
      className="px-2 py-2 ml-0 w-16 flex justify-center"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {warehouse.enabled ? 'Inhibit' : 'Enable'}
    </Button>
  )
}

export default WarehouseList
