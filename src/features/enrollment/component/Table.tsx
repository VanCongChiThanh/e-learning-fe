import React from "react"

interface Column<T> {
  header: string
  accessor: keyof T | string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
    data: T[]
}

function Table<T extends { id: string | number }>({ columns, data }: TableProps<T>) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {columns.map((col, idx) => (
              <td
                key={idx}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {col.render ? col.render(row) : (row as any)[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
