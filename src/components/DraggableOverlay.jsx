import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableOverlay = ({ activeId, students }) => {
  if (!activeId) return null;

  const student = students.find(s => s.id === activeId);

  return (
    <DragOverlay adjustScale={true} dropAnimation={{
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      keyframes: ({ transform }) => [
        { transform: CSS.Transform.toString(transform.initial) },
        { 
          transform: CSS.Transform.toString({
            ...transform.final,
            scaleX: 0.98,
            scaleY: 0.98
          })
        },
        { transform: CSS.Transform.toString(transform.final) }
      ]
    }}>
      <div 
        style={{
          transform: CSS.Transform.scale(1.05),
        }}
        className="p-2 border-2 border-primary rounded-lg text-center bg-default-100 shadow-xl"
      >
        {student?.name}
      </div>
    </DragOverlay>
  );
};

export default DraggableOverlay;
