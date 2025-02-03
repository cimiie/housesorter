import React, { useCallback, useState, useMemo, memo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import useStudentStore from '../stores/StudentStore'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { Spacer, Listbox, ListboxItem, Button, Input } from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'

const Dropzone = ({ handleFileUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'text/csv': ['.csv']
    }
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the CSV file here ...</p>
      ) : (
        <p>Drag and drop CSV file here, or click to select file</p>
      )}
    </div>
  )
}

Dropzone.propTypes = {
  handleFileUpload: PropTypes.func.isRequired
}

const StudentListItem = memo(({ student, onRemove }) => (
  <ListboxItem
    key={student.id}
    textValue={student.name}
    className="flex justify-between items-center text-base"
    endContent={
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="text-danger"
        onClick={() => onRemove(student.id)}
      >
        <Trash2 size={16} />
      </Button>
    }
  >
    <span className="text-lg">{student.name}</span>
  </ListboxItem>
));

StudentListItem.displayName = 'StudentListItem';

StudentListItem.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onRemove: PropTypes.func.isRequired
};

const Students = () => {
  const { students, addStudent, addStudents, removeStudent, removeAllStudents } = useStudentStore()
  const [newStudent, setNewStudent] = useState('')
  const parentRef = useRef(null)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Add this new useEffect for initial mount
  useEffect(() => {
    if (students.length > 0) {
      // Force virtualization update on mount if there are existing students
      setForceUpdate(prev => prev + 1)
    }
  }, []) // Empty dependency array for mount only

  useEffect(() => {
    if (students.length === 1) {
      // Force virtualization update on first item
      setTimeout(() => {
        setForceUpdate(prev => prev + 1)
      }, 0)
    }
  }, [students.length])

  const handleAddStudent = (e) => {
    if (e) e.preventDefault()
    if (newStudent.trim()) {
      addStudent({ name: newStudent.trim() })
      setNewStudent('')
      // Immediate update for first item
      if (students.length === 0) {
        setTimeout(() => {
          setForceUpdate(prev => prev + 1)
        }, 0)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddStudent()
    }
  }

  const handleFileUpload = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        complete: (results) => {
          const wasEmpty = students.length === 0
          const newStudents = results.data
            .filter(row => row[0] && row[0].trim().includes(' '))
            .map(row => ({ name: row[0].trim() }))
          addStudents(newStudents)
          if (wasEmpty && newStudents.length > 0) {
            setForceUpdate(prev => prev + 1)
          }
        },
        header: false,
        skipEmptyLines: true
      })
    })
  }, [addStudents, students.length])

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
    initialOffset: 0, // Add this to ensure proper initial positioning
  })

  const virtualizedContent = useMemo(() => (
    <div ref={parentRef} className="h-[270px] overflow-auto">
      <Listbox
        aria-label="Student list"
        variant="flat"
        className="relative"
        items={students}
        key={`${students.length}-${forceUpdate}`}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const student = students[virtualRow.index]
          return (
            <ListboxItem
              key={student.id}
              textValue={student.name}
              className="flex justify-between items-center text-base"
              endContent={
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-danger"
                  onClick={() => removeStudent(student.id)}
                >
                  <Trash2 size={16} />
                </Button>
              }
            >
              <span className="text-lg">{student.name}</span>
            </ListboxItem>
          )
        })}
      </Listbox>
    </div>
  ), [students, removeStudent, rowVirtualizer, forceUpdate])

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="container mx-auto max-w-2xl p-4">
        <Dropzone handleFileUpload={handleFileUpload} />
        
        <Spacer y={1} />
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              name="no-name"
              id="no-name"
              autoComplete="new-password"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleAddStudent();
                }
              }}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Enter student name (First Last)"
              className="flex-1"
              classNames={{
                input: "text-small",
                inputWrapper: "font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
            />
            <Button 
              color="primary" 
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </div>

          <div className="border rounded-lg p-2">
            {students.length === 0 ? (
              <div className="h-[270px] flex items-center justify-center">
                <p className="text-default-500 text-lg">No Students</p>
              </div>
            ) : (
              virtualizedContent
            )}
          </div>
          
          <Spacer y={1} />
          
          <div className="flex justify-between items-center">
            <Button
              color="danger"
              variant="flat"
              size="sm"
              onClick={removeAllStudents}
              className="text-sm"
              isDisabled={students.length === 0}
            >
              Remove All
            </Button>
            <div className="text-xl font-semibold text-primary">
              Total Students: {students.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Students
