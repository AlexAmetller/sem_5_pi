import { Navigate, useParams } from 'react-router-dom'
import { savePackaging, useDeliveries, usePackaging } from '../../services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Delivery } from '../../types/delivery'
import Header from '../../components/Header'
import Loader from '../../components/Loader'
import Button from '../../components/Button'
import Form, { TextInput, SelectInput } from '../../components/Form'
import { emptyPackaging } from '../../utils/models'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { Packaging, PackagingForm, zPackagingForm } from '../../types/packaging'

export const PackagingEditor = ({ create = false }: { create?: boolean }) => {
  const id = create ? undefined : useParams<{ id: string }>().id

  const { data, isError } = usePackaging(id)
  const { data: deliveries, isError: deliveryError } = useDeliveries()

  if (isError || deliveryError) {
    return <Header title={'Some error occurred...'} />
  }

  if (!deliveries) return <Loader className="h-32" />

  if (deliveries.length === 0) {
    return (
      <Header
        small
        title={'There is no delivery data to create a packaging...'}
      />
    )
  }

  const packaging = create ? emptyPackaging() : data

  if (!packaging) return <Loader className="h-32" />

  const title = create ? `Add new Packaging` : `Packaging ${packaging.id}`

  return (
    <div className="flex flex-col">
      <Header title={title} />
      <PackagingFormEditor
        packaging={packaging}
        deliveries={deliveries}
        create={create}
      />
    </div>
  )
}

export const PackagingFormEditor: FC<{
  packaging: Packaging
  deliveries: Delivery[]
  create: boolean
}> = ({ packaging, create, deliveries }) => {
  const [disabled, setDisabled] = useState(Boolean(packaging.deliveryId))
  const { mutateAsync: save, isLoading, isSuccess } = savePackaging(create)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PackagingForm>({
    resolver: zodResolver(zPackagingForm),
    defaultValues: {
      ...packaging,
      deliveryId:
        packaging.deliveryId.length === 0
          ? deliveries[0].code
          : packaging.deliveryId,
    },
  })

  if (isSuccess) return <Navigate to="/dashboard/packaging" />

  const onSubmit = (p: PackagingForm) => {
    toast.promise(() => save({ ...p, id: packaging.id }), {
      pending: 'Saving packaging...',
      success: {
        render() {
          return 'Packaging saved!'
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
          disabled={disabled || isLoading || !create}
          options={deliveries.map((t) => ({
            value: t.code,
            label: t.code,
          }))}
          title="Delivery:"
          {...register('deliveryId')}
          error={errors.deliveryId?.message}
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Position X"
          {...register('xposition', { valueAsNumber: true })}
          error={errors.xposition?.message}
          placeholder="Position X"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Position Y"
          {...register('yposition', { valueAsNumber: true })}
          error={errors.yposition?.message}
          placeholder="Position Y"
          type="number"
          step="1"
        />
        <TextInput
          disabled={disabled || isLoading}
          title="Position Z"
          {...register('zposition', { valueAsNumber: true })}
          error={errors.zposition?.message}
          placeholder="Position Z"
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

export default PackagingEditor
