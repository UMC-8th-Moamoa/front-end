import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ShopHeaderProps {
  title: string
  type: 'sort' | 'filter'
  options: string[]
  selected: string
  onSelect: (value: string) => void
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  type,
  options,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (value: string) => {
    onSelect(value)
    setIsOpen(false) // 선택 후 닫기
  }

  return (
   <div className="w-full px-4 py-3 relative">
      <div className="flex justify-between items-center w-full">
        {/* 왼쪽 텍스트 */}
        <div className="text-[#6282E1] text-lg font-semibold">
          {title}
        </div>

        {/* 오른쪽 드롭다운 버튼 */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center rounded-lg border border-[#C7D5FF] px-3 py-1.5 text-sm font-medium text-[#6282E1] hover:bg-gray-50"
          >
            {selected}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-2 w-25 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-[#C7D5FF]">
              <div className="py-1">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={
                      'block w-full px-4 py-2 text-sm text-left ' +
                      (option === selected
                        ? 'bg-gray-100 text-[#6282E1]'
                        : 'text-[#6282E1] hover:bg-gray-100')
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}