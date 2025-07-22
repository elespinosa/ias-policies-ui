import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  inputSize?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      id,
      iconLeft,
      iconRight,
      inputSize = "md",
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId()
    const hasError = !!error

    const requiredBg =
      props.required && !props.disabled
        ? "bg-amber-50 dark:bg-amber-900"
        : "bg-background"

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
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
            <span className="absolute left-3 top-3 text-muted-foreground">
              {iconLeft}
            </span>
          )}

          <textarea
            id={textareaId}
            ref={ref}
            className={cn(
              "w-full rounded-md border shadow-sm outline-none transition resize-y",
              "placeholder:text-muted-foreground",
              requiredBg,
              hasError
                ? "border-destructive focus:ring-1 focus:ring-destructive"
                : "border-input focus:border-primary focus:ring-1 focus:ring-primary",
              props.disabled && "cursor-not-allowed opacity-50",
              iconLeft && "pl-10",
              iconRight && "pr-10",
              sizeClasses[inputSize],
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              helperText || error ? `${textareaId}-help` : undefined
            }
            {...props}
          />

          {iconRight && (
            <span className="absolute right-3 top-3 text-muted-foreground">
              {iconRight}
            </span>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={`${textareaId}-help`}
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

TextArea.displayName = "TextArea"

export { TextArea }
