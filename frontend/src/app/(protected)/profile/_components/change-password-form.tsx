"use client"

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
import { useState } from "react"

const FormSchema = z.object({
  oldPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password don't match",
  path: ["confirmPassword"]
});

export default function ChangePasswordForm() {
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
      await axiosPrivate.put("/api/v1/users/change-password",
        JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        })
      )
      form.reset()
      toast.success("Updated password success 🎉")
      setPending(false)
    } catch (error) {
      setPending(false)
      console.log(error)
      // @ts-expect-error "idk"
      if (!error?.response) {
        toast.error("Server not respond")
        // @ts-expect-error "idk"
      } else if (error.response?.status === 404) {
        toast.warning("User Not Found")
        // @ts-expect-error "idk"
      } else if (error.response?.status === 400) {
        // @ts-expect-error "idk"
        toast.error(error.response?.data?.message)
      } else {
        toast.error("Internal Server Error")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
        <div className="flex justify-end items-center gap-4">
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


