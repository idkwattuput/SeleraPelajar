import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Item } from "@/types/item"
import { useState } from "react"

interface Props {
  items: Item[]
  onSearch: (value: string) => void
  onCategoryClick: (category: string) => void
}

export default function SearchItems({ items, onSearch, onCategoryClick }: Props) {
  const categories = items.map(item => item.category)
  const removeDupplicateCategories = [...new Set(categories.map(category => category.name))]
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  function handleCategoryClick(category: string) {
    setSelectedCategory(category)
    onCategoryClick(category)
  }

  return (
    <div className="flex items-center gap-4">
      <Input placeholder="Search..." className="w-[300px]" onChange={(e) => {
        onSearch(e.target.value)
        setSelectedCategory(null)
      }} />
      <Button
        variant={"ghost"}
        onClick={() => {
          onSearch("")
          setSelectedCategory(null)
        }}
      >
        All
      </Button>
      {removeDupplicateCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "secondary" : "ghost"}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

