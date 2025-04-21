"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"

export type TagInputProps = {
  placeholder?: string
  tags: string[]
  className?: string
  onTagAdd?: (tag: string) => void
  onTagRemove?: (tag: string) => void
  disabled?: boolean
}

export function TagInput({
  placeholder = "Digite e pressione enter...",
  tags = [],
  className,
  onTagAdd,
  onTagRemove,
  disabled = false,
  ...props
}: TagInputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    
    const value = inputValue.trim()

    if (e.key === "Enter" && value) {
      e.preventDefault()
      if (!tags.includes(value) && onTagAdd) {
        onTagAdd(value)
      }
      setInputValue("")
    } else if (e.key === "Backspace" && !value && tags.length > 0) {
      if (onTagRemove) {
        onTagRemove(tags[tags.length - 1])
      }
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 border border-input rounded-md bg-transparent px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="h-fit max-w-[calc(100%-2rem)] text-ellipsis break-keep">
          {tag}
          {!disabled && (
            <button
              type="button"
              className="ml-2 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => onTagRemove && onTagRemove(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remover {tag}</span>
            </button>
          )}
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-20"
        placeholder={tags.length === 0 ? placeholder : ""}
        {...props}
      />
    </div>
  )
}