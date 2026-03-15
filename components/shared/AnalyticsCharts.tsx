"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#a855f7"];

export function SkillRadarChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.every(d => d.value === 0)) return null;
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillBarChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} width={100} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubmissionPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  if (!data || data.every(d => d.value === 0)) return null;
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrowthAreaChart({ data }: { data: { label: string; score: number }[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
          <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#areaGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionBarChart({ data }: { data: { name: string; completed: number; total: number }[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
          <Bar dataKey="total" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Total" />
          <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
          <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
