import * as React from "react"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
  showPasswordToggle?: boolean
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      id,
      iconLeft,
      iconRight,
      type,
      inputSize = "md",
      showPasswordToggle,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const hasError = !!error
    const [showPassword, setShowPassword] = React.useState(false)

    const isPasswordType = type === "password" && showPasswordToggle
    const inputType = isPasswordType ? (showPassword ? "text" : "password") : type

    const requiredBg =
      props.required && !props.disabled
        ? "bg-amber-50 dark:bg-amber-900"
        : "bg-background"

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium",
              hasError ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconLeft}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cn(
              "w-full rounded-md border shadow-sm outline-none transition",
              "placeholder:text-muted-foreground",
              requiredBg,
              hasError
                ? "border-destructive focus:ring-1 focus:ring-destructive"
                : "border-input focus:border-primary focus:ring-1 focus:ring-primary",
              props.disabled && "cursor-not-allowed opacity-50",
              iconLeft && "pl-10",
              (iconRight || isPasswordType) && "pr-10",
              sizeClasses[inputSize],
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              helperText || error ? `${inputId}-help` : undefined
            }
            {...props}
          />

          {(isPasswordType || iconRight) && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                isPasswordType && "cursor-pointer"
              )}
              onClick={() =>
                isPasswordType ? setShowPassword((prev) => !prev) : undefined
              }
            >
              {isPasswordType ? (
                showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )
              ) : (
                iconRight
              )}
            </span>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={`${inputId}-help`}
            className={cn(
              "text-sm",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    )
  }
)

TextInput.displayName = "TextInput"

export { TextInput }
