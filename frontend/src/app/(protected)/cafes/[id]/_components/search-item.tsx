import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Item } from "@/types/item"

interface Props {
  items: Item[]
  onSearch: (value: string) => void
}

export default function SearchItems({ items, onSearch }: Props) {
  const categories = items.map(item => item.category)
  const removeDupplicateCategories = [...new Set(categories.map(category => category.name))]

  return (
    <div className="flex items-center gap-4">
      <Input placeholder="Search..." className="w-[300px]" onChange={(e) => onSearch(e.target.value)} />
      {removeDupplicateCategories.map((category) => (
        <Button key={category} variant={"ghost"}>{category}</Button>
      ))}
    </div>
  )
}

