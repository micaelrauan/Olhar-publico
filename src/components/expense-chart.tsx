"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { brl } from "@/lib/utils";

export function ExpenseChart({ data }: { data: { name: string; value: number }[] }) { return <div style={{ width: "100%", height: 230 }} role="img" aria-label="Gráfico de gastos por categoria"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 12, right: 20 }}><CartesianGrid stroke="var(--line)" horizontal={false} /><XAxis type="number" tickFormatter={(v: number) => `${Math.round(v / 1000)} mil`} stroke="var(--muted)" /><YAxis type="category" dataKey="name" width={115} stroke="var(--muted)" /><Tooltip formatter={(value) => brl(Number(value))} /><Bar dataKey="value" fill="var(--blue)" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div>; }
