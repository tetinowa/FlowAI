"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Renders a styled label element and forwards all props to the underlying label root.
 *
 * Merges the provided `className` with the component's default styling and includes a
 * `data-slot="label"` attribute for slotting and styling purposes.
 *
 * @param className - Additional CSS classes to merge with the component's default classes
 * @returns The rendered label JSX element
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
