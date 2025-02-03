import { Button } from '@nextui-org/react'
import { Download } from 'lucide-react'
import useStudentStore from '../stores/StudentStore'
import { useHouseStore } from '../stores/houseStore'

const Export = () => {
  const { distributedStudents } = useStudentStore()
  const { houses } = useHouseStore()

  const exportToCSV = () => {
    const csvRows = []
    const maxLength = Math.max(...Object.values(distributedStudents).map(arr => arr.length))
    
    // Add header row
    const headerRow = houses.slice(0, 4).map(house => house.name || `House ${houses.indexOf(house) + 1}`)
    csvRows.push(headerRow.join(','))
    
    // Add data rows
    for (let i = 0; i < maxLength; i++) {
      const row = houses.slice(0, 4).map(house => {
        const students = distributedStudents[house.id] || []
        return students[i] ? `"${students[i].name}"` : ''
      })
      csvRows.push(row.join(','))
    }
    
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'house_assignments.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      variant="light"
      startContent={<Download size={20} />}
      className="dark:text-white"
      onClick={exportToCSV}
    >
      Export CSV
    </Button>
  )
}

export default Export