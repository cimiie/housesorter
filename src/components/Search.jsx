import React, { useState, useCallback } from 'react'
import { Input } from '@nextui-org/react'
import { Search as SearchIcon } from 'lucide-react'
import useSearchStore from '../stores/searchStore'
import { debounce } from 'lodash' // Add this import

const Search = () => {
  const [inputValue, setInputValue] = useState('')
  const { setSearchTerm } = useSearchStore()

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value.toLowerCase())
    }, 300),
    []
  )

  const handleSearch = (e) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  return (
    <Input
      classNames={{
        base: "w-[180px] h-10",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      placeholder="Search for a student..."
      size="sm"
      startContent={<SearchIcon size={18} />}
      type="search"
      value={inputValue}
      onChange={handleSearch}
    />
  )
}

export default Search