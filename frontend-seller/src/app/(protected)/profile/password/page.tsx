import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ChangePasswordForm from '../_components/change-password-form'

export default function PasswordChange() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change your password</CardTitle>
      </CardHeader>
      <CardContent className=''>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  )
}

