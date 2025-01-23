import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Item } from "@/types/item"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  item: Item
  open: boolean
  onOpenChange: (v: boolean) => void
  onChange: (item: Item) => void
}

export default function DeleteItemDialog({ item, open, onOpenChange, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  async function deleteItem() {
    try {
      setPending(true)
      await axiosPrivate.delete(`/api/v1/items/${item.id}`)
      onChange(item)
      setPending(false)
      onOpenChange(false)
    } catch (error) {
      setPending(false)
      onOpenChange(false)
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {item.name}?</DialogTitle>
          <DialogDescription>This action will permanently remove item.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            disabled={pending}
            onClick={() => deleteItem()}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

