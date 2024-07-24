import { useNavigate } from 'react-router-dom'
import { PaginatedTableData } from '../interfaces'
import FilterListIcon from '@mui/icons-material/FilterList'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import CheckIcon from '@mui/icons-material/Check'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useEffect, useState } from 'react'
import { DateInput, SelectInput, TextInput } from './Form'
import Button from './Button'
import { useForm } from 'react-hook-form'

const filterOperators = {
  text: [
    { key: 'eq', label: 'is' },
    { key: 'ne', label: 'is not' },
    { key: 'regex', label: 'like' },
  ],
  number: [
    { key: 'lt', label: '<' },
    { key: 'lte', label: '<=' },
    { key: 'gt', label: '>' },
    { key: 'ge', label: '>=' },
    { key: 'eq', label: '==' },
    { key: 'ne', label: '!=' },
  ],
  date: [
    { key: 'eq', label: 'is' },
    { key: 'ge', label: 'starts' },
    { key: 'le', label: 'ends' },
  ],
}

const allFilterOerators = [
  ...filterOperators.date,
  ...filterOperators.number,
  ...filterOperators.text,
]

function SortButton({
  colLabel,
  colKey,
  sortKey,
  sortOrder,
  sortable,
  onSort,
}: {
  colLabel: string
  colKey: string
  sortKey: string | undefined
  sortOrder: 'asc' | 'desc' | undefined
  sortable: boolean
  onSort: (key: string) => void
}) {
  return (
    <div
      className={`flex items-center ${
        sortable ? 'group hover:cursor-pointer' : ''
      }`}
      onClick={() => sortable && onSort(colKey)}
    >
      {colLabel}
      {sortable && colKey === sortKey && sortOrder === 'asc' && (
        <ArrowDropDownIcon fontSize="medium" color="info" />
      )}
      {sortable && colKey === sortKey && sortOrder === 'desc' && (
        <ArrowDropUpIcon fontSize="medium" color="info" />
      )}
      {sortable && colKey !== sortKey && (
        <div className="group-hover:opacity-100 opacity-0 transition ml-1">
          <ImportExportIcon fontSize="small" color="action" />
        </div>
      )}
    </div>
  )
}

type FormValues = {
  key: string
  values: {
    text: { value: string; operator: string }
    number: { value: number; operator: string }
    date: { value: string | undefined; operator: string }
  }
}

const FilterForm = ({
  onFilter,
  filterCols,
}: {
  onFilter: (key: string, value: string) => void
  filterCols: { label: string; key: string; type: 'date' | 'text' | 'number' }[]
}) => {
  const { register, handleSubmit, watch, setFocus } = useForm<FormValues>({
    defaultValues: {
      key: filterCols[0].key,
      values: {
        text: { value: '', operator: 'eq' },
        number: { value: 0, operator: 'lt' },
        date: { value: undefined, operator: 'eq' },
      },
    },
  })
  const key = watch('key')
  const values = watch('values')
  const valueType = (key: string) =>
    filterCols.find((col) => col.key === key)?.type ?? 'text'
  const onSubmit = (data: FormValues) => {
    const { value, operator } = data.values[valueType(data.key)]
    if (value && operator) onFilter(data.key, `${operator}:${value}`)
  }
  useEffect(() => {
    setFocus(`key`)
  }, [])

  const type = valueType(key)
  const disabled = (() => {
    if (type === 'text') return values[type]?.value === ''
    if (type === 'number') return isNaN(Number(values[type]?.value))
    if (type === 'date')
      return values[type]?.value === undefined || values[type]?.value === ''
  })()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-row flex gap-2 bg-slate-50 p-2 transparent">
        <SelectInput
          options={filterCols.map((col) => ({
            value: col.key,
            label: col.label,
          }))}
          {...register('key')}
        />
        {type === 'text' && (
          <>
            <SelectInput
              options={filterOperators.text.map((col) => ({
                value: col.key,
                label: col.label,
              }))}
              {...register('values.text.operator')}
            />
            <TextInput
              {...register('values.text.value')}
              placeholder="filter"
            />
          </>
        )}
        {type === 'number' && (
          <>
            <SelectInput
              options={filterOperators.number.map((col) => ({
                value: col.key,
                label: col.label,
              }))}
              {...register('values.number.operator')}
            />
            <TextInput
              {...register('values.number.value', { valueAsNumber: true })}
              placeholder="filter"
              type="number"
              step="1"
            />
          </>
        )}
        {type === 'date' && (
          <>
            <SelectInput
              options={filterOperators.date.map((col) => ({
                value: col.key,
                label: col.label,
              }))}
              {...register('values.date.operator')}
            />
            <DateInput {...register('values.date.value')} placeholder="Date" />
          </>
        )}
        <Button
          type="submit"
          className="cursor-pointer px-0 py-0 p-0 w-9 h-9 justify-center"
          disabled={disabled}
        >
          <CheckIcon fontSize="medium" color="inherit" />
        </Button>
      </div>
    </form>
  )
}

const FilterTag = ({
  label,
  value,
  remove,
}: {
  label: string
  value: string
  remove: () => void
}) => {
  const [operator, quantity] = value.split(':', 2)
  const op = allFilterOerators.find(({ key }) => operator === key)?.label ?? ''
  return (
    <div
      className="border-1 py-1 px-3 flex gap-2 rounded-full bg-blue-200
      hover:bg-red-200 hover:cursor-pointer transition hover:shadow-md
      text-slate-700 hover:text-slate-900"
      onClick={remove}
    >
      <span className="font-semibold">{label}:</span>
      <span className="font-normal">{`${op} ${quantity}`}</span>
    </div>
  )
}

const Filters = ({
  filterCols,
  filters,
  onFilter,
}: {
  filterCols: { label: string; key: string; type: 'date' | 'text' | 'number' }[]
  filters: { [K in string]: string }
  onFilter: (key: string, value: string | null) => void
}) => {
  const [filterEditor, setFilterEditor] = useState(false)
  if (filterCols.length === 0) return null
  return (
    <div className="flex ml-4 relative">
      <button className="py-2" onClick={() => setFilterEditor((open) => !open)}>
        <FilterListIcon fontSize="medium" color="inherit" />
      </button>
      {filterEditor && (
        <div
          id="backdrop"
          className="transparent w-full h-full top-0 left-0 fixed z-0"
          onClick={() => setFilterEditor(false)}
        />
      )}
      <div className="absolute top-8 -left-2">
        {filterEditor && (
          <>
            <div className="z-20">
              <FilterForm
                onFilter={(key, value) => {
                  setFilterEditor(false)
                  onFilter(key, value)
                }}
                filterCols={filterCols}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {Object.entries(filters).map(([key, value]) => {
          const col = filterCols.find((filter) => filter.key === key)
          if (!col) return null
          return (
            <FilterTag
              label={col.label}
              value={value}
              key={key}
              remove={() => onFilter(key, null)}
            />
          )
        })}
      </div>
    </div>
  )
}

function Paginator({
  onPageChange,
  totalCount,
  limit,
  page,
}: {
  onPageChange: (limit: string, page: string) => void
  totalCount: number
  limit: number
  page: number
}) {
  const changeLimit = (limit: string) => onPageChange(limit, 1)
  const changePage = (page: number) => onPageChange(String(limit), String(page))
  const last = Math.max(1, Math.ceil(totalCount / limit))
  const list = (() => {
    const list: Array<string> = []
    if (page > 1) list.push('<')
    if (page !== 1) list.push('1')
    if (page > 3) list.push('...')
    if (page > 2) list.push(String(page - 1))
    list.push(String(page))
    if (page < last - 1) list.push(String(page + 1))
    if (page < last - 2) list.push('...')
    if (page !== last) list.push(String(last))
    if (page < last) list.push('>')
    return list
  })()

  const start = (page - 1) * limit + 1
  const end = Math.min(totalCount, start + limit - 1)

  return (
    <div className="flex items-center gap-4 text-slate-500">
      <SelectInput
        options={[5, 10, 25, 50, 100].map((val) => ({
          value: String(val),
          label: `${val} / page`,
        }))}
        value={String(limit)}
        onBlur={() => Promise.resolve(true)}
        onChange={(e) => {
          changeLimit(e.target.value)
          return Promise.resolve(true)
        }}
        name="perpage"
      />
      <span className="font-light text-sm">{`${start}-${end} of ${totalCount}`}</span>
      <div className="ml-auto flex gap-2 text-slate-500 items-center">
        {list.map((i, idx) => {
          if (i === '>')
            return (
              <div
                className="cursor-pointer hover:text-red-500"
                onClick={() => changePage(page + 1)}
                key={idx}
              >
                <ChevronRightIcon fontSize="small" color="inherit" />
              </div>
            )
          if (i === '<')
            return (
              <div
                className="cursor-pointer hover:text-red-500"
                onClick={() => changePage(page + 1)}
                key={idx}
              >
                <ChevronLeftIcon
                  fontSize="small"
                  color="inherit"
                  onClick={() => changePage(page - 1)}
                />
              </div>
            )
          const isCurrentPage = i === String(page)
          return (
            <div
              className={`${
                isCurrentPage ? 'text-red-700 font-bold text-md bg-red-100' : ''
              } py-0 px-1.5 rounded-sm cursor-pointer hover:bg-red-200 hover:text-slate-700`}
              onClick={() => changePage(Number(i))}
              key={idx}
            >
              {i}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PaginatedTable(props: PaginatedTableData) {
  const { numbered, emptyLabel, pagination, onPaginate, cols, totalCount } =
    props
  const navigate = useNavigate()

  const onSort = (key: string) => {
    const order =
      key !== pagination._sort
        ? 'asc'
        : pagination._order === 'asc'
        ? 'desc'
        : 'asc'
    onPaginate({ ...pagination, _sort: key, _order: order, _page: 1 }, true)
  }

  const onFilter = (key: string, value: string | null) => {
    const filters = Object.assign({}, pagination.filters)
    if (!value) {
      delete filters[key]
    } else {
      filters[key] = value
    }
    onPaginate({ ...pagination, filters, _page: 1 }, true)
  }

  const onPageChange = (limit: string, page: string) => {
    onPaginate(
      { ...pagination, _limit: Number(limit), _page: Number(page) },
      true
    )
  }

  const start = (pagination._page - 1) * pagination._limit
  const rows = props.rows
  const reverse = pagination._sort === 'id' && pagination._order === 'desc'

  return (
    <div className="py-4">
      <div
        className="w-full text-sm text-slate-900 shadow-md lg:shadow-none
        rounded-2xl bg-slate-100 lg:bg-slate-50 py-2 px-7 lg:p-0"
      >
        <Filters
          filterCols={cols.filter((col) => col.filterable)}
          onFilter={onFilter}
          filters={pagination.filters}
        />
        <table className="w-full">
          <thead className="border-b">
            <tr>
              {(numbered
                ? [{ key: 'id', label: '#', sortable: true }, ...cols]
                : cols
              ).map((col, idx) => (
                <th
                  key={`${idx}-${col}`}
                  scope="col"
                  className="px-6 py-4 text-left font-medium"
                >
                  <SortButton
                    colLabel={col.label}
                    colKey={col.key}
                    sortKey={pagination._sort}
                    sortOrder={pagination._order}
                    sortable={col.sortable}
                    onSort={onSort}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ link, onClick, cols, disabled = false }, rowIdx) => {
              return (
                <tr
                  key={`row-${rowIdx}`}
                  onClick={() => {
                    if (!disabled) {
                      link && navigate(link)
                      onClick?.()
                    }
                  }}
                  className={`border-b last-of-type:border-b-0 ${
                    (link || onClick) && !disabled
                      ? 'lg:hover:bg-slate-100 hover:bg-slate-50 cursor-pointer'
                      : ''
                  }`}
                >
                  {numbered && (
                    <td className="px-6 py-4 font-medium">
                      {reverse
                        ? totalCount - rowIdx - start
                        : rowIdx + 1 + start}
                    </td>
                  )}
                  {cols.map((col, colIdx) => (
                    <td
                      key={`row-${rowIdx}-col-${colIdx}`}
                      className={`px-6 py-4 font-light ${
                        disabled ? 'text-slate-500' : ''
                      }`}
                    >
                      {col}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!rows.length && emptyLabel && (
          <span className="flex justify-center w-full my-6">{emptyLabel}</span>
        )}
        <Paginator
          limit={pagination._limit}
          onPageChange={onPageChange}
          page={pagination._page}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}

export default PaginatedTable
