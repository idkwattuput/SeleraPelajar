import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item } from "@/types/item"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode, useEffect, useState } from "react"
import CategoryComboBox from "./category-combobox";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean
  item: Item
  onChange: (item: Item) => void
  onOpenChange: (v: boolean) => void
}

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must atleast 3 charaters"
  }).max(30, {
    message: "Maximum name is up to 30 characters only"
  }),
  description: z.string().max(30).optional(),
  price: z.coerce.number().positive().multipleOf(0.01),
  categoryId: z.string(),
});

export default function EditItemDialog({ item, open, onChange, onOpenChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      price: Number(item.price),
      categoryId: item.category_id,
    },
  });

  function handleCategoryChanges(value: string) {
    form.setValue("categoryId", value)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.put(`/api/v1/items/${item.id}`,
        JSON.stringify({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          categoryId: data.categoryId,
          image: item.image
        })
      )
      form.reset()
      toast.success(`Item ${data.name} updated`)
      onChange(response.data.data)
      setPending(false)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your item here. Click save when you&apos;re done
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Chicken Chop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="This is a chicken chop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="6.00" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <CategoryComboBox onChange={handleCategoryChanges} categoryName={item.category.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"} onClick={() => {
              form.reset()
            }}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={pending}>
            {!pending && "Save"}
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

