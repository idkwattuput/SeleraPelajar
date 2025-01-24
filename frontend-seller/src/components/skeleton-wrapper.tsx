import { ReactNode } from 'react'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'

export default function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = true,
  className = ""
}: {
  children: ReactNode
  isLoading: boolean
  fullWidth?: boolean
  className?: string
}) {
  if (!isLoading) return children
  return (
    <Skeleton className={cn(fullWidth && "w-full", className)}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  )
}
