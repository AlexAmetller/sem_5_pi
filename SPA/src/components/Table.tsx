import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableData } from '../interfaces'

const Table: FC<TableData> = ({ cols, rows, numbered = true, emptyLabel }) => {
  const navigate = useNavigate()
  return (
    <div className="py-4">
      <div
        className="w-full text-sm text-slate-900 shadow-md lg:shadow-none
        rounded-2xl bg-slate-100 lg:bg-slate-50 py-2 px-7 lg:p-0"
      >
        <table className="w-full">
          <thead className="border-b">
            <tr>
              {(numbered ? ['#', ...cols] : cols).map((col, idx) => (
                <th
                  key={`${idx}-${col}`}
                  scope="col"
                  className="px-6 py-4 text-left font-medium"
                >
                  {col}
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
                    <td className="px-6 py-4 font-medium">{rowIdx + 1}</td>
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
      </div>
    </div>
  )
}

export default Table
