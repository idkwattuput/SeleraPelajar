"use client"

import {
  CloudUpload,
  Loader2,
  Paperclip
} from "lucide-react"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@/components/ui/file-upload"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryComboBox from "./category-combobox";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { toast } from "sonner";
import { Item } from "@/types/item";

interface Props {
  children: ReactNode
  onChange: (item: Item) => void
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
  itemImage: z.string().optional(),
});

export default function CreateItemDialog({ children, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [files, setFiles] = useState<File[] | null>(null);
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const dropZoneConfig = {
    accept: {
      "image/*": []
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      itemImage: "",
    },
  });

  function handleCategoryChanges(value: string) {
    form.setValue("categoryId", value)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const formData = new FormData()
      formData.append("name", data.name.trim());
      formData.append("description", data.description?.trim() || "");
      formData.append("price", String(data.price));
      formData.append("categoryId", data.categoryId);
      // @ts-expect-error "idk"
      formData.append("itemImage", files ? files[0] : null);
      const response = await axiosPrivate.post("/api/v1/items",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      form.reset({
        name: "",
      })

      toast.success(`Item ${data.name} created`)
      onChange(response.data.data)
      setPending(false)
      setOpen((prev) => !prev)
    } catch (error) {
      console.error(error)
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
          <DialogDescription>Please fill form below to create an item</DialogDescription>
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
                render={({ }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <CategoryComboBox onChange={handleCategoryChanges} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="itemImage"
              render={({ }) => (
                <FormItem>
                  <FormLabel>Item Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        idName="itemImage"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className='text-gray-500 w-10 h-10' />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or JPEG
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"} onClick={() => {
              form.reset()
            }}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={pending}>
            {!pending && "Create"}
            {pending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

