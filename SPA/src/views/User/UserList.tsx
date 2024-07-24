import { NavLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Table from '../../components/Table'
import Button from '../../components/Button'
import { useUsers, deleteUser } from '../../services'
import { toast } from 'react-toastify'
import ErrorMessage from '../../components/ErrorMessage'

const UserList = () => {
  const { data, isLoading, isError } = useUsers()

  if (isError) return <ErrorMessage />

  if (isLoading || !data) return <Loader className="h-32" />

  return (
    <>
      <AddButton />
      <Header title={'Users'} />
      <Table
        emptyLabel="No user found"
        cols={['Mail', 'Name', 'Phone', 'Role', 'Status', '']}
        rows={
          data
            ?.slice()
            .reverse()
            .map((user) => ({
              cols: [
                user.status === 'deleted'
                  ? user.mail.slice(0, 10) + '...' + user.mail.slice(-10)
                  : user.mail,
                user.name,
                user.role,
                user.phoneNumber,
                user.status,
                user.status === 'active' ? (
                  <DeleteButton key={user.mail} mail={user.mail} />
                ) : null,
              ],
              disabled: user.status === 'deleted',
              link: `${encodeURIComponent(user.mail)}`,
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
          <span>Add user</span>
        </Button>
      </NavLink>
    </div>
  )
}

const DeleteButton = ({ mail }: { mail: string }) => {
  const { mutateAsync } = deleteUser()
  const onClick = () => {
    toast.promise(() => mutateAsync(mail), {
      pending: 'Deleting user...',
      success: {
        render() {
          return 'User deleted!'
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
      className="px-2 py-2"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <DeleteIcon fontSize="small" />
    </Button>
  )
}

export default UserList
