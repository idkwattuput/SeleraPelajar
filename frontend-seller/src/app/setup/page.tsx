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
  Paperclip
} from "lucide-react"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@/components/ui/file-upload"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must atleast 3 charaters"
  }).max(30, {
    message: "Maximum name is up to 30 characters only"
  }),
  description: z.string().max(60, {
    message: "Maximum description is up to 30 characters only"
  }).optional(),
  cafeImage: z.string().optional(),
  block: z.string().min(1, {
    message: "Block must atleast 1 charater"
  }).max(10, {
    message: "Maximum block is up to 10 characters only"
  }),
  lot: z.string().min(1, {
    message: "Lot must atleast 1 charater"
  }).max(9, {
    message: "Maximum lot is up to 9 characters only"
  }),
});

export default function Setup() {
  const axiosPrivate = useAxiosPrivate()
  const router = useRouter()
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
      name: "",
      description: "",
      cafeImage: "",
      block: "",
      lot: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData()
      formData.append("name", data.name.trim());
      formData.append("description", data.description?.trim() || "");
      formData.append("block", data.block.trim());
      formData.append("lot", data.lot.trim());
      formData.append("cafeImage", files ? files[0] : "");
      await axiosPrivate.post("/api/v1/cafes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      toast.success("Welcome to Selera Pelajar 🎉")
      router.push("/dashboard")
    } catch (error) {
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
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold font-header italic">Selera Pelajar</h1>
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Setup Cafe</CardTitle>
          <CardDescription>
            Please fill form below to setup your cafe. Don&apos;t worry you can change it later after this.
          </CardDescription>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Example Cafe" {...field} />
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
                      <Input placeholder="This is description cafe (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Block <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lot"
                  render={({ field }) => (
                    <FormItem className="grid w-full gap-2">
                      <FormLabel>Lot <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="cafeImage"
                render={({ }) => (
                  <FormItem>
                    <FormLabel>Cafe Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
                        <FileInput
                          idName="cafeImage"
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
              <Button type="submit" className="w-full">Done</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

