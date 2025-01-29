import { Spinner } from '@nextui-org/react'

const TableLoading = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-default-600">Shuffling</p>
      </div>
    </div>
  )
}

export default TableLoading
