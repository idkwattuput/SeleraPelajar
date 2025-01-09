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
import useAxiosPrivate from "@/hooks/use-axios-private"
import { useEffect, useState } from "react"
import { User } from "../page"
import SkeletonWrapper from "@/components/skeleton-wrapper"

const FormSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().min(3),
});

interface Props {
  user: User | null
  isLoading: boolean
  onChange: (user: User) => void
}

export default function ProfileForm({ user, isLoading, onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: user ? user?.first_name : "",
      lastName: user ? user?.last_name : "",
      email: user ? user?.email : "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.put("/api/v1/users",
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      )
      onChange(response.data.data)
      toast.success("Updated profile info 🎉")
      setPending(false)
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <SkeletonWrapper isLoading={isLoading}>
                    <Input placeholder="John" {...field} />
                  </SkeletonWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <SkeletonWrapper isLoading={isLoading}>
                    <Input {...field} placeholder="Doe" />
                  </SkeletonWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <SkeletonWrapper isLoading={isLoading}>
                  <Input {...field} placeholder="example@mail.com" />
                </SkeletonWrapper>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end items-end gap-4">
          <Button
            type="submit"
            disabled={!form.formState.isDirty || pending}
          >
            {pending ? (<Loader2 className="animate-spin" />) : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

