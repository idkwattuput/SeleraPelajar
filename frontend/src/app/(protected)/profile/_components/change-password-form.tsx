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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FormSchema = z.object({
  oldPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
});

interface Props {
  onChange: (user: User) => void
}

export default function ChangePasswordForm({ onChange }: Props) {
  const axiosPrivate = useAxiosPrivate()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setPending(true)
      const response = await axiosPrivate.put("/api/v1/users/change-password",
        JSON.stringify({
          password: data.newPassword,
        })
      )
      onChange(response.data.data)
      toast.success("Updated password success 🎉")
      setPending(false)
    } catch (error) {
      setPending(false)
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[500px] grid gap-4">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <Button
            disabled={pending}
            variant={"secondary"}
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || pending}
          >
            {pending ? (<Loader2 />) : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}


