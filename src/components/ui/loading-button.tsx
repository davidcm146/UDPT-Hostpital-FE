import { ButtonHTMLAttributes, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

export function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
