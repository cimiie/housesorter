import React from 'react'
import { Card, Divider } from '@nextui-org/react'
import { useHouseStore } from '../stores/houseStore'
import { flexRender } from '@tanstack/react-table'

const TableHeader = ({ table }) => {
  const { houses, houseTotals } = useHouseStore()
  
  return (
    <div className="sticky top-0 left-0 right-0 bg-transparent backdrop-blur-md border-b border-default-200 z-40">
      <div className="p-4 flex gap-4">
        {table.getFlatHeaders().map((header, index) => (
          <div key={header.id} className="flex-1 min-w-[200px]">
            <Card className="p-2 shadow-none bg-transparent">
              <h3 className="text-lg md:text-xl font-semibold text-center text-default-600">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </h3>
              <Divider className="my-2 bg-default-200" />
              <p className="text-small text-center text-default-500">
                Students: {houseTotals?.[houses[index]?.id] || 0}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableHeader
