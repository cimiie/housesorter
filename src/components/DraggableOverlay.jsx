import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { Card } from '@nextui-org/react';
import { Lock, Unlock } from 'lucide-react';

const DraggableOverlay = ({ activeId, students, lockedStudents }) => {
  if (!activeId) return null;

  const student = students.find(s => s.id === activeId);

  return (
    <DragOverlay>
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
            {student?.name || ''}
          </div>
        </div>
      </Card>
    </DragOverlay>
  );
};

export default DraggableOverlay;
