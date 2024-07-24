import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { useTrucks, updateTruckStatus } from '../../services'
import { toast } from 'react-toastify'
import ErrorMessage from '../../components/ErrorMessage'

const TruckList = () => {
  const { data, isLoading, isError } = useTrucks()

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Trucks'} />
      <Table
        emptyLabel="No truck found"
        cols={[
          'ID',
          'Tare',
          'Max Weight',
          'Max Charge',
          'Range',
          'Charging Time',
          'Status',
        ]}
        rows={
          data
            ?.slice()
            .reverse()
            .map((t) => ({
              cols: [
                t.id,
                String(t.tare),
                String(t.maxWeight),
                String(t.maxCharge),
                String(t.range),
                String(t.chargingTime),
                <ToggleButton id={t.id} enabled={t.enabled} />,
              ],
              link: `${t.id}`,
              disabled: !t.enabled,
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
          <span>Add truck</span>
        </Button>
      </NavLink>
    </div>
  )
}

const ToggleButton = ({ id, enabled }: { id: string; enabled: boolean }) => {
  const { mutateAsync } = updateTruckStatus(id)
  const onClick = () => {
    toast.promise(() => mutateAsync(!enabled), {
      pending: 'Inhibiting truck...',
      success: {
        render() {
          return `Truck ${enabled ? 'inhibited!' : 'enabled!'}`
        },
      },
      error: {
        render(err) {
          return `${err.data}`
        },
      },
    })
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
      {enabled ? 'Inhibit' : 'Enable'}
    </Button>
  )
}

export default TruckList
