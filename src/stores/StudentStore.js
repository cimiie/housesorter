import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

// Helper to get initial state from session storage
const getInitialState = () => {
  const storedStudents = sessionStorage.getItem('students')
  return storedStudents ? JSON.parse(storedStudents) : []
}

const useStudentStore = create((set, get) => ({
  students: getInitialState(),
  
  addStudent: (student) => {
    const studentWithId = {
      ...student,
      id: student.id || uuidv4()
    }
    const updatedStudents = [studentWithId, ...get().students]
    sessionStorage.setItem('students', JSON.stringify(updatedStudents))
    set({ students: updatedStudents })
  },
  
  addStudents: (newStudents) => {
    const studentsWithIds = newStudents.map(student => ({
      ...student,
      id: student.id || uuidv4()
    }))
    const updatedStudents = [...get().students, ...studentsWithIds]
    sessionStorage.setItem('students', JSON.stringify(updatedStudents))
    set({ students: updatedStudents })
  },
  
  removeStudent: (studentId) => {
    const updatedStudents = get().students.filter(s => s.id !== studentId)
    const removedStudent = get().students.find(s => s.id === studentId)
    
    // Remove the student from distributedStudents as well
    const updatedDistribution = { ...get().distributedStudents }
    Object.keys(updatedDistribution).forEach(houseId => {
      updatedDistribution[houseId] = updatedDistribution[houseId]
        .filter(student => student.id !== studentId)
    })
    
    sessionStorage.setItem('students', JSON.stringify(updatedStudents))
    set({ students: updatedStudents, distributedStudents: updatedDistribution })
  },
  
  clearStudents: () => {
    sessionStorage.removeItem('students')
    set({ students: [] })
  },

  sortStudents: (columnId, direction) => {
    const students = [...get().students]
    const sorted = students.sort((a, b) => {
      if (direction === 'asc') {
        return (a[columnId] || '').localeCompare(b[columnId] || '')
      }
      return (b[columnId] || '').localeCompare(a[columnId] || '')
    })
    set({ students: sorted })
    sessionStorage.setItem('students', JSON.stringify(sorted))
  },

  distributedStudents: {},

  updateDistributedStudents: (newDistribution) => set(() => ({ 
    distributedStudents: newDistribution 
  })),

  distributeStudents: (houseIds) => {
    const students = [...get().students]
    const distribution = {}
    
    // Initialize all house arrays
    houseIds.forEach(houseId => {
      distribution[houseId] = []
    })

    // Get locked students from session storage
    const stored = sessionStorage.getItem('lockedStudents')
    const lockedStudentsMap = stored ? new Map(JSON.parse(stored)) : new Map()

    // First, distribute locked students
    students.forEach(student => {
      const lockedHouseId = lockedStudentsMap.get(student.id)
      if (lockedHouseId && houseIds.includes(lockedHouseId)) {
        distribution[lockedHouseId].push({
          id: student.id,
          name: student.name
        })
      }
    })

    // Get remaining unlocked students
    const unlockedStudents = students.filter(student => 
      !lockedStudentsMap.has(student.id)
    )

    // Fisher-Yates shuffle
    const fisherYatesShuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const shuffledStudents = fisherYatesShuffle([...unlockedStudents])

    // Calculate slots per house
    const totalUnlocked = shuffledStudents.length
    const houseSlotsRemaining = {}
    
    houseIds.forEach(houseId => {
      const lockedCount = distribution[houseId].length
      const baseSize = Math.floor(totalUnlocked / houseIds.length)
      houseSlotsRemaining[houseId] = baseSize
    })

    // Distribute remaining students
    let currentIndex = 0
    shuffledStudents.forEach(student => {
      const availableHouses = houseIds.filter(id => 
        distribution[id].length < houseSlotsRemaining[id] + (distribution[id].filter(s => 
          lockedStudentsMap.has(s.id)
        ).length)
      )
      
      if (availableHouses.length > 0) {
        const targetHouse = availableHouses[currentIndex % availableHouses.length]
        distribution[targetHouse].push({
          id: student.id,
          name: student.name
        })
        currentIndex++
      }
    })

    // Sort each house's students by name
    houseIds.forEach(houseId => {
      const lockedStudentsInHouse = distribution[houseId].filter(s => 
        lockedStudentsMap.has(s.id)
      )
      const unlockedStudentsInHouse = distribution[houseId].filter(s => 
        !lockedStudentsMap.has(s.id)
      ).sort((a, b) => a.name.localeCompare(b.name))

      distribution[houseId] = [...lockedStudentsInHouse, ...unlockedStudentsInHouse]
    })

    // Ensure we store the distribution with student objects
    set({ distributedStudents: distribution })
    sessionStorage.setItem('distributedStudents', JSON.stringify(distribution))
    return distribution
  },

  removeAllStudents: () => {
    sessionStorage.removeItem('students')
    sessionStorage.removeItem('distributedStudents')
    set({ students: [], distributedStudents: {} })
  }
}))

export default useStudentStore
