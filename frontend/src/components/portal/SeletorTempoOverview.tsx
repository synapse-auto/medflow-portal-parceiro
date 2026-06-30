"use client";

// Seletor de recorte temporal da Visão Geral (RF-019): toggle "ano inteiro" (padrão) vs
// "por mês". Em "por mês" o usuário escolhe todos ou apenas alguns meses do ano selecionado.
// Substitui os antigos filtros de período/mês de originação e o input de comparativo.

import { X } from "lucide-react";

import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;

const TODOS_OS_MESES = Array.from({ length: 12 }, (_, i) => i + 1);

interface Props {
  ano: number;
  anosDisponiveis: number[];
  porMes: boolean;
  meses: number[]; // meses selecionados (1-12) quando porMes
  dia: string; // data de originação exata (ISO aaaa-mm-dd); "" = todos os dias
  onAno: (ano: number) => void;
  onPorMes: (porMes: boolean) => void;
  onMeses: (meses: number[]) => void;
  onDia: (iso: string) => void;
}

export function SeletorTempoOverview({
  ano,
  anosDisponiveis,
  porMes,
  meses,
  dia,
  onAno,
  onPorMes,
  onMeses,
  onDia,
}: Props) {
  const anos = anosDisponiveis.length > 0 ? anosDisponiveis : [ano];
  const todosSelecionados = meses.length === 12;

  function alternaMes(m: number) {
    onMeses(meses.includes(m) ? meses.filter((x) => x !== m) : [...meses, m].sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={String(ano)} onValueChange={(v) => onAno(Number(v))}>
            <SelectTrigger className="h-9 w-[110px] tabular-nums" aria-label="Ano">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {anos.map((a) => (
                  <SelectItem key={a} value={String(a)} className="tabular-nums">
                    {a}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Field orientation="horizontal" className="w-auto">
            <Checkbox
              id="recorte-por-mes"
              checked={porMes}
              onCheckedChange={(v) => onPorMes(v === true)}
              aria-label="Recorte por mês"
            />
            <Label
              htmlFor="recorte-por-mes"
              className={cn("cursor-pointer text-sm font-normal", !porMes && "text-muted-foreground")}
            >
              {porMes ? "Por mês" : "Ano inteiro"}
            </Label>
          </Field>

          {/* Filtro por dia de originação (data do pedido) — calendário em popover. */}
          <div className="flex items-center gap-1">
            <DatePicker
              value={dia}
              onChange={onDia}
              placeholder="Dia de originação"
              className="h-9 w-[170px]"
              aria-label="Filtrar por dia de originação"
            />
            {dia ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-9 shrink-0 text-muted-foreground"
                aria-label="Limpar filtro de dia"
                onClick={() => onDia("")}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>

        {porMes ? (
          <button
            type="button"
            onClick={() => onMeses(todosSelecionados ? [] : TODOS_OS_MESES)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {todosSelecionados ? "Limpar" : "Selecionar todos"}
          </button>
        ) : null}
      </div>

      {porMes ? (
        <div className="flex flex-wrap gap-1.5">
          {MESES.map((nome, i) => {
            const m = i + 1;
            const ativo = meses.includes(m);
            return (
              <button
                key={nome}
                type="button"
                aria-pressed={ativo}
                onClick={() => alternaMes(m)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium ring-1 transition-colors",
                  ativo
                    ? "bg-primary/10 text-primary ring-primary/25"
                    : "bg-muted text-muted-foreground ring-border hover:text-foreground",
                )}
              >
                {nome}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
