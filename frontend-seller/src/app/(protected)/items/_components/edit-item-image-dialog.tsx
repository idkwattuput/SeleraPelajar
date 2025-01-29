"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Item } from "@/types/item"

const formSchema = z.object({
  itemImage: z.string().optional(),
});

interface Props {
  item: Item
  open: boolean
  onOpenChange: (v: boolean) => void
  onChange: (updatedCafe: Item) => void
}

export default function EditItemImageDialog({ item, open, onOpenChange, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    accept: {
      "image/*": []
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemImage: "",
    },
  })

  async function onSubmit() {
    try {
      setPending(true)
      const formData = new FormData()
      // @ts-expect-error "idk"
      formData.append("itemImage", files ? files[0] : null);
      const response = await axiosPrivate.put(`/api/v1/items/image/${item.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      toast.success("Edit image successfull")
      setPending(false)
      onChange(response.data.data)
      setFiles(null)
      onOpenChange(false)
    } catch (error) {
      setPending(false)
      // @ts-expect-error "idk"
      if (!error?.response) {
        toast.error("Server not respond")
        // @ts-expect-error "idk"
      } else if (error.response?.status === 400) {
        console.log(error)
        // @ts-expect-error "idk"
        toast.error(error.response.data.message)
      } else {
        toast.error("Internal Server Error")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Cafe Image</DialogTitle>
          <DialogDescription>
            Please fill form below to edit your cafe
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Close</Button>
              </DialogClose>
              <Button
                disabled={pending}
                type="submit"
              >
                {pending ? (<Loader2 className="animate-spin" />) : "Done"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

