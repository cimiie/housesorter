import React from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function StudentCard({ student, columnId }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: student.id,
    data: {
      columnId
    }
  })

  const style = React.useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDragging ? 0.4 : 1,
  }), [transform, transition, isDragging])

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="w-full bg-content2 cursor-move transition-all duration-200 select-none"
      shadow="sm"
      {...attributes}
      {...listeners}
    >
      <CardBody className="p-3">
        <p className="text-center pointer-events-none">{student.name}</p>
      </CardBody>
    </Card>
  )
}
