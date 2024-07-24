export type DrawerData = {
  header: {
    title: string
    icon: JSX.Element
  }
  links: Array<{
    url: string
    icon: JSX.Element
    title: string
    disabled?: boolean
  }>
}

export type TableData = {
  emptyLabel?: string
  numbered?: boolean
  cols: string[]
  rows: Array<{
    link?: string
    onClick?: () => void
    disabled?: boolean
    cols: Array<string | JSX.Element | null>
  }>
}

export type Pagination = {
  _limit: number
  _page: number
  _sort?: string
  _order?: 'desc' | 'asc'
  filters: {
    [K in string]: string
  }
}

export type PaginatedTableData = {
  emptyLabel?: string
  numbered?: boolean
  cols: Array<{
    key: string
    label: string
    sortable: boolean
    filterable: boolean
    type: 'date' | 'text' | 'number'
  }>
  rows: Array<{
    link?: string
    onClick?: () => void
    disabled?: boolean
    cols: Array<string | JSX.Element | null>
  }>
  pagination: Pagination
  totalCount: number
  onPaginate: (pagination: Pagination, replace?: boolean) => void
}
