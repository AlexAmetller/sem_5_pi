import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../interfaces'
import { makeURLParameters, parseQuery } from '../utils/pagination'

// Headers:
//     Links -> first, prev, next, last
//     X-Total-Count -> count
//
// Pagination
//     _page=2
//     _limit=50
//
// Order
//     _sort=views
//     _order=asc
//
// Operators
//     _ge _gte _le _lte _ne _like
//
// Filter
//     _foo=bar
//     _foo=bar&foo=baz
//
// e.g: ?_limit=10&_page=1&_sort=id&_order=asc

export function usePagination() {
  const [search, setSearch] = useSearchParams()

  const pagination = parseQuery(search)

  const onPaginate = (p: Pagination, replace = false) => {
    setSearch(makeURLParameters(p), { replace: false })
  }

  return { pagination, onPaginate }
}
