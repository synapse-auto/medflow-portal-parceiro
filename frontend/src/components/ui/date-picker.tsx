"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// ISO "yyyy-MM-dd" <-> Date (meia-noite local, sem desvio de fuso — casa com lib/format).
function isoParaData(iso: string): Date | undefined {
  if (!iso) return undefined
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function dataParaIso(d: Date): string {
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, "0")
  const dia = String(d.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

interface DatePickerProps {
  /** Valor ISO "yyyy-MM-dd" ("" = vazio). */
  value: string
  /** Recebe ISO "yyyy-MM-dd" ("" quando limpo). */
  onChange: (iso: string) => void
  placeholder?: string
  className?: string
  id?: string
  "aria-label"?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Escolher data",
  className,
  id,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [aberto, setAberto] = React.useState(false)
  const data = isoParaData(value)

  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          data-empty={!data}
          className={cn(
            "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {data ? (
            <span className="tabular-nums">{format(data, "dd/MM/yyyy", { locale: ptBR })}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          autoFocus
          locale={ptBR}
          selected={data}
          defaultMonth={data}
          onSelect={(d) => {
            onChange(d ? dataParaIso(d) : "")
            setAberto(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
