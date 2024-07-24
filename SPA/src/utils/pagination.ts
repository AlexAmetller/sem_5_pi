import { Pagination } from '../interfaces'

export const makeURLParameters = (p: Pagination) => {
  const query = new URLSearchParams()
  query.append('_limit', String(p._limit))
  query.append('_page', String(p._page))
  if (p._sort) query.append('_sort', String(p._sort))
  if (p._order) query.append('_order', String(p._order))
  for (const filter in p.filters) {
    query.append(filter, p.filters[filter])
  }
  return query
}

export const parseQuery = (query: URLSearchParams): Pagination => {
  const sort = query.get('_sort')
  const order = query.get('_order')
  const limit = Number(query.get('_limit')) || 5
  return {
    _limit: [5, 10, 25, 50, 100].reduce((prev, curr) =>
      Math.abs(curr - limit) < Math.abs(prev - limit) ? curr : prev
    ),
    _page: Number(query.get('_page')) || 1,
    _sort: sort ?? undefined,
    _order: order ? (order === 'desc' ? 'desc' : 'asc') : undefined,
    filters: Object.fromEntries(
      Object.entries(Object.fromEntries(query)).filter(
        ([key, value]) =>
          !['_limit', '_page', '_sort', '_order'].includes(key) &&
          typeof value === 'string'
      )
    ),
  }
}

export const makeQueryKey = (key: string, p: Pagination) => {
  const params = makeURLParameters(p)
  const queryKey = [key, params.toString()]
  return queryKey
}
