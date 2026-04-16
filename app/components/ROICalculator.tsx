"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle,
  X,
  Mail,
  Building2,
  User,
  Zap,
  Shield,
  BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Inputs {
  teamSize: number;
  regime: "clt" | "pj";
  baseSalary: number;
  commissionPct: number;
  benefits: number;
  monthlySalesVolume: number;
  mgmtHours: number;
  errorRate: number;
  managerHourlyRate: number;
}

interface LeadForm {
  name: string;
  email: string;
  company: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
    ...opts,
  }).format(v);

const fmtNum = (v: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(v);

// ─── Slider component ─────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${pct}%, #e2e8f0 ${pct}%)`,
          accentColor: "#3b82f6",
        }}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumberInput({
  label,
  value,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        {prefix && <span className="text-slate-400 text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 outline-none text-slate-800 font-medium text-sm bg-transparent min-w-0"
        />
        {suffix && <span className="text-slate-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: "green" | "blue" | "red" | "yellow";
}) {
  const palettes = {
    green: { bg: "bg-green-50", text: "text-green-600", val: "text-green-700", icon: "text-green-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", val: "text-blue-700", icon: "text-blue-500" },
    red: { bg: "bg-red-50", text: "text-red-600", val: "text-red-700", icon: "text-red-500" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", val: "text-yellow-700", icon: "text-yellow-500" },
  };
  const p = palettes[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${p.bg} rounded-2xl p-5 flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} className={p.icon} />
        <span className={`text-xs font-semibold uppercase tracking-wide ${p.text}`}>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${p.val}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-slate-600">{fmt(payload[0].value)}<span className="text-slate-400 font-normal">/mês</span></p>
      </div>
    );
  }
  return null;
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export default function ROICalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    teamSize: 10,
    regime: "clt",
    baseSalary: 3500,
    commissionPct: 5,
    benefits: 800,
    monthlySalesVolume: 500000,
    mgmtHours: 20,
    errorRate: 3,
    managerHourlyRate: 80,
  });

  const [showModal, setShowModal] = useState(false);
  const [lead, setLead] = useState<LeadForm>({ name: "", email: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof Inputs) => (v: number | "clt" | "pj") =>
    setInputs((prev) => ({ ...prev, [k]: v }));

  const calc = useMemo(() => {
    const { teamSize, regime, baseSalary, commissionPct, benefits, monthlySalesVolume, mgmtHours, errorRate, managerHourlyRate } = inputs;

    const avgCommission = (baseSalary * commissionPct) / 100;
    const grossPerPerson = baseSalary + avgCommission;

    let costPerPerson: number;
    if (regime === "clt") {
      costPerPerson = grossPerPerson * 1.75 + benefits;
    } else {
      costPerPerson = grossPerPerson * 1.06;
    }

    const totalPeopleCost = costPerPerson * teamSize;

    // Custo de ineficiência
    const hoursWasteCost = mgmtHours * managerHourlyRate;
    const errorCost = monthlySalesVolume * (errorRate / 100);
    const inefficiencyCost = hoursWasteCost + errorCost;

    // Custo total manual
    const manualTotal = totalPeopleCost + inefficiencyCost;

    // Custo estimado RevTrack (baseado no time)
    const revtrackCost = teamSize <= 5 ? 397 : teamSize <= 15 ? 797 : teamSize <= 30 ? 1497 : 2497;

    // Economia
    const monthlySavings = inefficiencyCost - revtrackCost;
    const annualSavings = monthlySavings * 12;

    // Com RevTrack (apenas custo de pessoal + plano)
    const revtrackTotal = totalPeopleCost + revtrackCost;

    return {
      totalPeopleCost,
      hoursWasteCost,
      errorCost,
      inefficiencyCost,
      manualTotal,
      revtrackCost,
      revtrackTotal,
      monthlySavings,
      annualSavings,
      hoursFreed: mgmtHours,
      roi: revtrackCost > 0 ? ((monthlySavings / revtrackCost) * 100) : 0,
    };
  }, [inputs]);

  const chartData = [
    { name: "Gestão Manual", value: Math.round(calc.manualTotal) },
    { name: "Com RevTrack", value: Math.round(calc.revtrackTotal) },
  ];

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    const payload = {
      fields: [
        { objectTypeId: "0-1", name: "firstname", value: lead.name },
        { objectTypeId: "0-1", name: "email", value: lead.email },
        { objectTypeId: "0-1", name: "company", value: lead.company },
        { objectTypeId: "0-1", name: "roi_annual_savings", value: String(Math.round(calc.annualSavings)) },
        { objectTypeId: "0-1", name: "team_size", value: String(inputs.teamSize) },
        { objectTypeId: "0-1", name: "monthly_error_cost", value: String(Math.round(calc.errorCost)) },
        { objectTypeId: "0-1", name: "regime", value: inputs.regime },
      ],
      context: { pageUri: window.location.href, pageName: "Calculadora ROI RevTrack" },
    };

    try {
      // Replace PORTAL_ID and FORM_ID with your HubSpot values
      const PORTAL_ID = "YOUR_PORTAL_ID";
      const FORM_ID = "YOUR_FORM_ID";
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("HubSpot error");
    } catch {
      // Silently degrade – still show success to user
    }

    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap size={12} />
          Calculadora de ROI — RevTrack Pulse
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
          Quanto sua empresa perde gerindo<br className="hidden md:block" /> comissões em planilhas?
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Ajuste os dados do seu time e veja em tempo real o impacto financeiro da ineficiência — e quanto a RevTrack pode recuperar.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Inputs Panel ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-blue-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Time de Vendas</h2>
            </div>

            <Slider
              label="Tamanho do Time"
              value={inputs.teamSize}
              min={1}
              max={100}
              step={1}
              onChange={set("teamSize")}
              display={`${inputs.teamSize} vendedores`}
            />

            {/* Regime Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Regime de Contratação</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                {(["clt", "pj"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => set("regime")(r)}
                    className={`flex-1 py-2 text-sm font-semibold transition-all ${
                      inputs.regime === r
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <NumberInput
              label="Salário Base Médio (R$)"
              value={inputs.baseSalary}
              prefix="R$"
              onChange={set("baseSalary")}
            />

            <Slider
              label="Comissão Média"
              value={inputs.commissionPct}
              min={0}
              max={30}
              step={0.5}
              onChange={set("commissionPct")}
              display={`${inputs.commissionPct}%`}
              hint="Percentual sobre o volume de vendas individual"
            />

            {inputs.regime === "clt" && (
              <NumberInput
                label="Benefícios por Pessoa (VR+VA+Saúde)"
                value={inputs.benefits}
                prefix="R$"
                onChange={set("benefits")}
              />
            )}
          </div>

          {/* Volume & Inefficiency */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={16} className="text-blue-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Operação e Ineficiência</h2>
            </div>

            <NumberInput
              label="Volume de Vendas Mensal (R$)"
              value={inputs.monthlySalesVolume}
              prefix="R$"
              onChange={set("monthlySalesVolume")}
            />

            <Slider
              label="Horas de Gestão por Mês"
              value={inputs.mgmtHours}
              min={1}
              max={100}
              step={1}
              onChange={set("mgmtHours")}
              display={`${inputs.mgmtHours}h`}
              hint="Horas gastas calculando comissões manualmente"
            />

            <NumberInput
              label="Custo/Hora do Gestor (R$)"
              value={inputs.managerHourlyRate}
              prefix="R$"
              suffix="/h"
              onChange={set("managerHourlyRate")}
            />

            <Slider
              label="Taxa de Erro Estimada"
              value={inputs.errorRate}
              min={0}
              max={10}
              step={0.1}
              onChange={set("errorRate")}
              display={`${inputs.errorRate.toFixed(1)}%`}
              hint="Média de mercado: 3% para gestão em planilhas"
            />
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* ROI Hero */}
          <motion.div
            key={calc.annualSavings}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl p-6 text-white ${calc.annualSavings >= 0 ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-slate-600 to-slate-700"}`}
          >
            <p className="text-sm font-semibold opacity-80 mb-1">Dinheiro Recuperado por Ano</p>
            <p className="text-5xl font-bold mb-2">{fmt(Math.max(0, calc.annualSavings))}</p>
            <p className="text-sm opacity-75">
              {calc.monthlySavings >= 0
                ? `${fmt(calc.monthlySavings)}/mês de economia líquida vs. custo do plano RevTrack`
                : "Ajuste os parâmetros para ver a economia estimada"}
            </p>
            {calc.roi > 0 && (
              <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                <TrendingUp size={12} />
                ROI de {fmtNum(calc.roi)}% ao mês
              </div>
            )}
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={AlertTriangle}
              label="Custo de Erros / Mês"
              value={fmt(calc.errorCost)}
              sub={`${inputs.errorRate.toFixed(1)}% do volume de vendas`}
              color="red"
            />
            <MetricCard
              icon={Clock}
              label="Custo de Horas / Mês"
              value={fmt(calc.hoursWasteCost)}
              sub={`${inputs.mgmtHours}h × R$${inputs.managerHourlyRate}/h`}
              color="yellow"
            />
            <MetricCard
              icon={DollarSign}
              label="Ineficiência Total / Mês"
              value={fmt(calc.inefficiencyCost)}
              sub="Horas + erros em planilha"
              color="red"
            />
            <MetricCard
              icon={Shield}
              label="Plano RevTrack / Mês"
              value={fmt(calc.revtrackCost)}
              sub={`Para ${inputs.teamSize} vendedor${inputs.teamSize > 1 ? "es" : ""}`}
              color="blue"
            />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Custo Operacional Comparativo / Mês</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={56} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  <Cell fill="#ef4444" />
                  <Cell fill="#3b82f6" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Composição de Custos</h3>
            <div className="space-y-3">
              {[
                { label: "Custo total com pessoal (encargos + comissão)", value: calc.totalPeopleCost, neutral: true },
                { label: "Horas de gestão desperdiçadas", value: calc.hoursWasteCost, bad: true },
                { label: "Erros em comissões e verbas", value: calc.errorCost, bad: true },
                { label: "Plano RevTrack (substituição completa)", value: calc.revtrackCost, good: true },
              ].map(({ label, value, neutral, bad, good }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${neutral ? "bg-slate-300" : bad ? "bg-red-400" : "bg-blue-400"}`}
                    />
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${neutral ? "text-slate-700" : bad ? "text-red-600" : "text-blue-600"}`}>
                    {fmt(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits list */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-blue-800 mb-3">O que a RevTrack elimina do seu processo:</p>
            <ul className="space-y-2">
              {[
                "Cálculo automático de comissões com regras personalizadas",
                "Alertas de divergência antes do fechamento da folha",
                "Dashboard de comissões em tempo real para os vendedores",
                "Relatórios prontos para eSocial e auditoria trabalhista",
                "Redução de {h}h de gestão manual por mês".replace("{h}", String(inputs.mgmtHours)),
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-blue-700">
                  <CheckCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors shadow-lg shadow-blue-200"
          >
            <Mail size={18} />
            Receber Relatório Detalhado no E-mail
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── Lead Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                      <BarChart2 size={22} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      Seu relatório está pronto!
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Enviaremos uma análise detalhada com base nos seus dados + um comparativo completo de ROI.
                    </p>
                  </div>

                  {/* Summary mini */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                    <p className="text-xs font-semibold text-green-700 mb-2">Resumo calculado</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Economia anual</p>
                        <p className="font-bold text-green-700">{fmt(Math.max(0, calc.annualSavings))}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Time de vendas</p>
                        <p className="font-bold text-slate-700">{inputs.teamSize} vendedores</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Custo de erros/mês</p>
                        <p className="font-bold text-red-600">{fmt(calc.errorCost)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Horas liberadas/mês</p>
                        <p className="font-bold text-blue-600">{inputs.mgmtHours}h</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        placeholder="Seu nome"
                        value={lead.name}
                        onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="email"
                        placeholder="E-mail corporativo"
                        value={lead.email}
                        onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        placeholder="Nome da empresa"
                        value={lead.company}
                        onChange={(e) => setLead((p) => ({ ...p, company: e.target.value }))}
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      {sending ? (
                        <span className="animate-pulse">Enviando...</span>
                      ) : (
                        <>
                          Receber Relatório Gratuito
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-slate-400">
                      Sem spam. Seus dados são usados apenas para enviar o relatório e nossa equipe entrar em contato.
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Relatório enviado!</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Verifique sua caixa de entrada. Nossa equipe entrará em contato em breve para apresentar uma proposta personalizada.
                  </p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Fechar
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
