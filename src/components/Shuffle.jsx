import React from 'react'
import { Button } from '@nextui-org/react'
import { Shuffle as ShuffleIcon } from 'lucide-react'
import useStudentStore from '../stores/StudentStore'
import { useHouseStore } from '../stores/houseStore'

const Shuffle = () => {
  const { distributeStudents } = useStudentStore()
  const { houses } = useHouseStore()

  const handleShuffle = () => {
    const houseIds = houses.slice(0, 4).map(house => house.id)
    distributeStudents(houseIds)
  }

  return (
    <Button
      variant="light"
      startContent={<ShuffleIcon size={20} />}
      onClick={handleShuffle}
    >
      Shuffle
    </Button>
  )
}

export default Shuffle