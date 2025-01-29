import { create } from 'zustand'

// Helper to get initial locked students from session storage
const getInitialLockedStudents = () => {
  const stored = sessionStorage.getItem('lockedStudents')
  return stored ? new Map(JSON.parse(stored)) : new Map()
}

const useLockStore = create((set, get) => ({
  lockedStudents: getInitialLockedStudents(),

  toggleLock: (studentName, houseId) => {
    const current = get().lockedStudents
    const updated = new Map(current)
    
    if (updated.has(studentName)) {
      updated.delete(studentName)
    } else {
      updated.set(studentName, houseId)
    }
    
    sessionStorage.setItem('lockedStudents', JSON.stringify(Array.from(updated)))
    set({ lockedStudents: updated })
  },

  clearLocks: () => {
    sessionStorage.removeItem('lockedStudents')
    set({ lockedStudents: new Map() })
  }
}))

export default useLockStore
