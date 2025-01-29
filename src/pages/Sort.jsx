import { useMemo, useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
  MeasuringStrategy,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from '@tanstack/react-table'
import { Card } from '@nextui-org/react'
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody'
import useStudentStore from '../stores/StudentStore'
import { useHouseStore } from '../stores/houseStore'
import useLockStore from '../stores/lockStore'
import { Lock, Unlock } from 'lucide-react'
import useSearchStore from '../stores/searchStore'
import TableLoading from '../components/TableLoading'

const Sort = () => {
  const [sorting, setSorting] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const { distributeStudents, distributedStudents, updateDistributedStudents } = useStudentStore()
  const { houses, updateHouseTotals } = useHouseStore()
  const { lockedStudents } = useLockStore()
  const { searchTerm } = useSearchStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const houseIds = houses.slice(0, 4).map(house => house.id)
    distributeStudents(houseIds)
    // Only show loading on initial mount
    setTimeout(() => {
      setIsInitialLoading(false)
    }, 800)
  }, [houses, distributeStudents]) // Added missing dependencies

  useEffect(() => {
    const houseIds = houses.slice(0, 4).map(house => house.id)
    const currentTotals = houseIds.reduce((acc, houseId) => {
      acc[houseId] = distributedStudents[houseId]?.length || 0
      return acc
    }, {})
    updateHouseTotals(currentTotals)
  }, [houses, distributedStudents, updateHouseTotals])
  
  const columnHelper = createColumnHelper()
  
  const columns = useMemo(() => 
    houses.slice(0, 4).map(house => columnHelper.accessor(house.id, {
      header: house.name || `House ${houses.indexOf(house) + 1}`,
      cell: info => {
        const students = distributedStudents[house.id] || []
        const index = parseInt(info.row.id)
        return students[index] || ''
      },
      enableSorting: true,
    })), [houses, distributedStudents]) // Added missing dependency

  const data = useMemo(() => {
    const maxLength = Math.max(...Object.values(distributedStudents).map(arr => arr.length))
    const filteredDistribution = {}

    if (searchTerm) {
      Object.entries(distributedStudents).forEach(([houseId, students]) => {
        filteredDistribution[houseId] = students.filter(student => 
          student?.name?.toLowerCase().includes(searchTerm)
        )
      })
    } else {
      Object.assign(filteredDistribution, distributedStudents)
    }

    return Array.from({ length: maxLength }, (_, index) => {
      const rowData = {}
      houses.slice(0, 4).forEach(house => {
        rowData[house.id] = filteredDistribution[house.id]?.[index] || ''
      })
      return rowData
    })
  }, [distributedStudents, houses, searchTerm])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over) return

    const activeHouseId = active.data.current?.houseId
    const overHouseId = over.data.current?.houseId
    const studentId = active.id

    // Find the actual student object
    const student = Object.values(distributedStudents)
      .flat()
      .find(s => s.id === studentId)

    if (!student) return

    const lockedColumnId = lockedStudents.get(studentId)
    if (lockedColumnId && lockedColumnId !== overHouseId) {
      return
    }

    if (activeHouseId !== overHouseId) {
      const updatedDistribution = { ...distributedStudents }
      const overIndex = over.data.current?.sortable?.index || updatedDistribution[overHouseId].length

      // Remove from source
      updatedDistribution[activeHouseId] = updatedDistribution[activeHouseId]
        .filter(s => s.id !== studentId)
      
      // Add to destination
      const destinationArray = [...(updatedDistribution[overHouseId] || [])]
      destinationArray.splice(overIndex, 0, student)
      updatedDistribution[overHouseId] = destinationArray

      updateDistributedStudents(updatedDistribution)

      const newTotals = Object.keys(updatedDistribution).reduce((acc, houseId) => {
        acc[houseId] = updatedDistribution[houseId].length
        return acc
      }, {})
      
      updateHouseTotals(newTotals)
    }
    setActiveId(null)
  }, [distributedStudents, updateDistributedStudents, updateHouseTotals, lockedStudents])

  const allStudentIds = useMemo(() => {
    return Object.values(distributedStudents)
      .flat()
      .filter(Boolean)
      .map(student => student.id);
  }, [distributedStudents]);

  return (
    <div className="w-full h-full">
      {isInitialLoading && <TableLoading />}
      <Card className="w-full h-full overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always
            }
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={allStudentIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col h-full">
              <TableHeader table={table} />
              <TableBody 
                table={table} 
                activeId={activeId}
                houses={houses}
                distributedStudents={distributedStudents}
              />
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && (
              <Card className="p-2 bg-default-100 min-w-[200px] shadow-lg select-none">
                <div className="flex items-center">
                  <div className="p-2 select-none">
                    {lockedStudents.has(activeId) ? (
                      <Lock size={16} className="text-danger pointer-events-none" />
                    ) : (
                      <Unlock size={16} className="text-default-400 pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1 text-center text-default-600 pointer-events-none">
                    {Object.values(distributedStudents)
                      .flat()
                      .find(student => student.id === activeId)?.name || ''}
                  </div>
                </div>
              </Card>
            )}
          </DragOverlay>
        </DndContext>
      </Card>
    </div>
  )
}

export default Sort
