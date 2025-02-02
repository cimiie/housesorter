import { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { flexRender } from '@tanstack/react-table'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@nextui-org/react'
import { Lock, Unlock } from 'lucide-react'
import useLockStore from '../stores/lockStore'
import { useVirtualizer } from '@tanstack/react-virtual'

const DraggableCell = ({ cell, houseId, index }) => {
  const student = cell.getValue()
  const { lockedStudents, toggleLock } = useLockStore()
  const isLocked = student && lockedStudents.has(student.id)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: student?.id || 'empty',
    data: {
      student,
      houseId,
      type: 'student',
      sortable: {
        index
      }
    },
    disabled: isLocked || !student
  })

  if (!student) return null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const handleLockClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Remove any drag listeners temporarily
    if (attributes['aria-pressed']) {
      attributes['aria-pressed'] = false
    }
    toggleLock(student.id, houseId)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        p-2 mb-2 transition-colors
        ${isLocked 
          ? 'bg-danger-50/50 hover:bg-danger-100/50' 
          : 'bg-transparent hover:bg-default-100/50'
        }
        ${isDragging ? 'ring-2 ring-primary' : ''}
        select-none relative
        before:absolute before:inset-0 before:z-[-1]
        before:transition-colors before:duration-200
        data-[dragover=true]:before:bg-primary/20
      `}
      data-dragover={isDragging}
      {...(!isLocked && attributes)}
      {...(!isLocked && listeners)}
    >
      <div className="flex items-center">
        <div 
          onClick={handleLockClick}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="cursor-pointer p-2 hover:bg-default-200 rounded-lg select-none"
        >
          {isLocked ? (
            <Lock size={16} className="text-danger pointer-events-none" />
          ) : (
            <Unlock size={16} className="text-default-400 pointer-events-none" />
          )}
        </div>
        
        <div className="flex-1 text-center text-default-600">
          {student.name}
        </div>
      </div>
    </Card>
  )
}

DraggableCell.propTypes = {
  cell: PropTypes.object.isRequired,
  houseId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}

const TableBody = ({ table }) => {
  const parentRef = useRef(null)
  
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
    scrollPaddingStart: 4,
    scrollPaddingEnd: 4
  })

  // Add resize observer cleanup
  useEffect(() => {
    const element = parentRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce the update
      requestAnimationFrame(() => {
        rowVirtualizer.measure()
      })
    })

    resizeObserver.observe(element)
    return () => {
      resizeObserver.disconnect()
    }
  }, [rowVirtualizer])

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div 
      ref={parentRef} 
      className="flex-1 overflow-auto"
      style={{ willChange: 'transform' }} // Optimization for scroll performance
    >
      <div className="p-2 flex gap-4 h-full">
        {table.getVisibleFlatColumns().map(column => (
          <div 
            key={column.id} 
            className="flex-1 min-w-[200px] relative"
            data-column-id={column.id}
          >
            <div 
              className="flex flex-col gap-2 relative min-h-full"
              style={{ height: `${Math.max(totalSize, '100%')}px` }}
            >
              {virtualRows.map(virtualRow => {
                const row = table.getRowModel().rows[virtualRow.index]
                const cell = row.getVisibleCells().find(c => c.column.id === column.id)
                
                return cell?.getValue() ? (
                  <div
                    key={`${column.id}-${cell.id}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                  >
                    <DraggableCell
                      cell={cell}
                      houseId={column.id}
                      index={virtualRow.index}
                    />
                  </div>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

TableBody.propTypes = {
  table: PropTypes.object.isRequired,
}

export default TableBody
