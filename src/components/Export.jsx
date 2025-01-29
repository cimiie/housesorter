import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Download } from 'lucide-react'
import useStudentStore from '../stores/StudentStore'
import { useHouseStore } from '../stores/houseStore'

const Export = () => {
  const { distributedStudents } = useStudentStore()
  const { houses } = useHouseStore()

  const generateXLSXContent = () => {
    const header = houses.slice(0, 4).map(house => house.name || `House ${houses.indexOf(house) + 1}`)
    const maxLength = Math.max(...Object.values(distributedStudents).map(arr => arr.length))
    
    let rows = []
    for (let i = 0; i < maxLength; i++) {
      const row = houses.slice(0, 4).map(house => {
        const students = distributedStudents[house.id] || []
        return students[i]?.name || ''
      })
      rows.push(row)
    }

    const xmlContent = `
      <?xml version="1.0"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
        <Worksheet ss:Name="House Assignments">
          <Table>
            <Row>
              ${header.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}
            </Row>
            ${rows.map(row => `
              <Row>
                ${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}
              </Row>
            `).join('')}
          </Table>
        </Worksheet>
      </Workbook>`.trim()

    return xmlContent
  }

  const exportToXLSX = () => {
    const xlsxContent = generateXLSXContent()
    const blob = new Blob([xlsxContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'house_assignments.xls')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          startContent={<Download size={20} />}
          className="dark:text-white"
        >
          Export
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Export options"
        className="dark:text-white"
      >
        <DropdownItem key="csv" onClick={exportToCSV} className="dark:text-white">
          Export as CSV
        </DropdownItem>
        <DropdownItem key="xlsx" onClick={exportToXLSX} className="dark:text-white">
          Export as Excel
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Export