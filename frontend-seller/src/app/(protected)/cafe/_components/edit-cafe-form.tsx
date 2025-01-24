import { Card, CardContent } from "@/components/ui/card"
import useAxiosPrivate from "@/hooks/use-axios-private"
import { Cafe } from "@/types/cafe";
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must atleast 3 charaters"
  }).max(30, {
    message: "Maximum name is up to 30 characters only"
  }),
  description: z.string().max(60, {
    message: "Maximum description is up to 30 characters only"
  }).optional(),
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

interface Props {
  cafe: Cafe
  onChange: (cafe: Cafe) => void
}

export default function EditCafeForm({ cafe, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: cafe ? cafe?.name : "",
      description: cafe ? cafe?.description : "",
      block: cafe ? cafe?.block : "",
      lot: cafe ? cafe?.lot : "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.put("/api/v1/cafes",
        JSON.stringify({
          name: data.name,
          description: data.description,
          block: data.block,
          lot: data.lot
        }),
      )
      onChange(response.data.data)
      toast.success("Edit cafe successfull")
      setPending(false)
    } catch (error) {
      setPending(false)
      if (!error?.response) {
        toast.error("Server not respond")
      } else if (error.response?.status === 400) {
        console.log(error)
        toast.error(error.response.data.message)
      } else {
        toast.error("Internal Server Error")
      }
    }
  }


  return (
    <Card>
      <CardContent className="mt-6">
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
            <div className="flex justify-end items-end">
              <Button
                type="submit"
                disabled={pending || !form.formState.isDirty}
              >
                {pending ? (<Loader2 />) : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

