"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { NumericFormat } from "react-number-format";
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
  Phone,
  User,
  Zap,
  Shield,
  BarChart2,
  Lock,
  TrendingDown,
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

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_NUMBER = "551152540869";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v);

const fmtNum = (v: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(v);

function buildWhatsAppUrl(teamSize: number, inefficiencyCost: number) {
  const msg = encodeURIComponent(
    `Olá! Acabei de usar a calculadora da RevTrack. Simulei para um time de ${teamSize} vendedores e vi que minha ineficiência mensal estimada é de ${fmt(inefficiencyCost)}. Gostaria de entender como a ferramenta pode me ajudar a recuperar esse valor.`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// ─── Slider component ─────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step, onChange, display, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display: string; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
        style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #e2e8f0 ${pct}%)`, accentColor: "#3b82f6" }}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumberInput({
  label, value, isCurrency, suffix, onChange,
}: {
  label: string; value: number; isCurrency?: boolean; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        {isCurrency ? (
          <NumericFormat
            value={value === 0 ? "" : value}
            onValueChange={({ floatValue }) => onChange(floatValue ?? 0)}
            thousandSeparator="." decimalSeparator="," decimalScale={0}
            allowNegative={false} prefix="R$ " placeholder="R$ 0"
            className="flex-1 outline-none text-slate-800 font-medium text-sm bg-transparent min-w-0"
          />
        ) : (
          <>
            <NumericFormat
              value={value === 0 ? "" : value}
              onValueChange={({ floatValue }) => onChange(floatValue ?? 0)}
              thousandSeparator="." decimalSeparator="," decimalScale={2}
              allowNegative={false} placeholder="0"
              className="flex-1 outline-none text-slate-800 font-medium text-sm bg-transparent min-w-0"
            />
            {suffix && <span className="text-slate-400 text-sm">{suffix}</span>}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  color: "green" | "blue" | "red" | "yellow";
}) {
  const palettes = {
    green: { bg: "bg-green-50", text: "text-green-600", val: "text-green-700", icon: "text-green-500" },
    blue:  { bg: "bg-blue-50",  text: "text-blue-600",  val: "text-blue-700",  icon: "text-blue-500"  },
    red:   { bg: "bg-red-50",   text: "text-red-600",   val: "text-red-700",   icon: "text-red-500"   },
    yellow:{ bg: "bg-yellow-50",text: "text-yellow-600",val: "text-yellow-700",icon: "text-yellow-500"},
  };
  const p = palettes[color];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className={`${p.bg} rounded-2xl p-5 flex flex-col gap-2`}>
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
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-slate-600">{fmt(payload[0].value)}<span className="text-slate-400 font-normal">/mês</span></p>
      </div>
    );
  }
  return null;
}

// ─── Gated Overlay ────────────────────────────────────────────────────────────

function GatedOverlay({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-10 rounded-2xl bg-white/60 backdrop-blur-sm p-6 text-center">
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <Lock size={24} className="text-blue-600" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">
        Desbloqueie o detalhamento completo do seu ROI
      </h3>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">
        Veja exatamente onde sua empresa está perdendo dinheiro e o gráfico comparativo.
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={onUnlock}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-colors"
      >
        <Lock size={14} />
        Desbloquear Análise Detalhada
      </motion.button>
    </div>
  );
}

// ─── WhatsApp Icon SVG ────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────

function LeadModal({
  onClose,
  onUnlock,
  calc,
  inputs,
}: {
  onClose: () => void;
  onUnlock: () => void;
  calc: { annualSavings: number; errorCost: number; inefficiencyCost: number };
  inputs: Inputs;
}) {
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const payload = {
      fields: [
        { name: "firstname", value: lead.name },
        { name: "email", value: lead.email },
        { name: "phone", value: lead.phone },
        { name: "message", value: `Time: ${inputs.teamSize} vendedores | Regime: ${inputs.regime.toUpperCase()} | Economia anual estimada: ${fmt(Math.max(0, calc.annualSavings))} | Ineficiência/mês: ${fmt(calc.inefficiencyCost)}` },
      ],
      context: { pageUri: window.location.href, pageName: "Calculadora ROI RevTrack" },
    };
    try {
      const PORTAL_ID = "50945418";
      const FORM_ID = "acdb15ef-05e4-4c1c-8dc4-3bb210588b55";
      await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch { /* silently degrade */ }
    setSending(false);
    setSubmitted(true);
    setTimeout(() => { onClose(); onUnlock(); }, 1800);
  }

  function handleWhatsApp() {
    const url = buildWhatsAppUrl(inputs.teamSize, calc.inefficiencyCost);
    window.open(url, "_blank");
    onClose();
    onUnlock();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>

          {!submitted ? (
            <>
              <div className="mb-5">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Lock size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Desbloqueie a análise completa</h2>
                <p className="text-slate-500 text-sm">
                  Escolha como quer receber o detalhamento do seu ROI.
                </p>
              </div>

              {/* Summary mini */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-green-700 mb-2">Sua simulação</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Economia anual</p>
                    <p className="font-bold text-green-700">{fmt(Math.max(0, calc.annualSavings))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Time de vendas</p>
                    <p className="font-bold text-slate-700">{inputs.teamSize} vendedores</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20b856] text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-md shadow-green-200 mb-4"
              >
                <WhatsAppIcon />
                Falar com especialista no WhatsApp
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">OU</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required placeholder="Seu nome" value={lead.name}
                    onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required type="email" placeholder="E-mail corporativo" value={lead.email}
                    onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required type="tel" placeholder="Telefone (WhatsApp)" value={lead.phone}
                    onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  {sending ? <span className="animate-pulse">Enviando...</span> : (<>Desbloquear Análise Agora <ChevronRight size={16} /></>)}
                </button>
                <p className="text-xs text-center text-slate-400">
                  Sem spam. Usamos seus dados apenas para enviar a análise.
                </p>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Análise desbloqueada!</h3>
              <p className="text-slate-500 text-sm">Confira todos os detalhes abaixo.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Exit Intent Popup ────────────────────────────────────────────────────────

function ExitIntentPopup({
  onClose,
  onWhatsApp,
  inefficiencyCost,
}: {
  onClose: () => void;
  onWhatsApp: () => void;
  inefficiencyCost: number;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown size={30} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Espere! Você está deixando <span className="text-red-600">{fmt(inefficiencyCost)}</span> na mesa todos os meses.
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Quer que um de nossos especialistas mostre como recuperar esse valor em 15 minutos? É rápido e sem compromisso.
          </p>
          <button
            onClick={onWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20b856] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-base transition-colors shadow-lg shadow-green-200 mb-3"
          >
            <WhatsAppIcon />
            Quero recuperar esse valor
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Não, prefiro continuar perdendo dinheiro
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
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

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const exitFiredRef = useRef(false);

  // Mark as interacted on any input change
  const set = (k: keyof Inputs) => (v: number | "clt" | "pj") => {
    setHasInteracted(true);
    setInputs((prev) => ({ ...prev, [k]: v }));
  };

  // Exit-intent: mouse leaves viewport top
  useEffect(() => {
    function handleMouseLeave(e: MouseEvent) {
      if (
        e.clientY <= 0 &&
        !isUnlocked &&
        hasInteracted &&
        !exitFiredRef.current &&
        !sessionStorage.getItem("exit_shown")
      ) {
        exitFiredRef.current = true;
        sessionStorage.setItem("exit_shown", "1");
        setShowExitIntent(true);
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isUnlocked, hasInteracted]);

  const calc = useMemo(() => {
    const { teamSize, regime, baseSalary, commissionPct, benefits, monthlySalesVolume, mgmtHours, errorRate, managerHourlyRate } = inputs;
    const isCLT = regime === "clt";
    const avgCommission = (baseSalary * commissionPct) / 100;
    const grossPerPerson = baseSalary + avgCommission;
    const costPerPerson = isCLT ? grossPerPerson * 1.75 + benefits : grossPerPerson * 1.06;
    const totalPeopleCost = costPerPerson * teamSize;
    const effectiveMgmtHours = isCLT ? mgmtHours * 1.2 : mgmtHours;
    const hoursWasteCost = effectiveMgmtHours * managerHourlyRate;
    const totalCommissions = monthlySalesVolume * (commissionPct / 100);
    const baseErrorCost = totalCommissions * (errorRate / 100);
    const errorCost = isCLT ? baseErrorCost * 1.7 : baseErrorCost;
    const legalRiskMonthly = isCLT ? (totalCommissions * 12 * 0.1) / 12 : 0;
    const churnRecovery = monthlySalesVolume * 0.01;
    const inefficiencyCost = hoursWasteCost + errorCost + legalRiskMonthly;
    const manualTotal = totalPeopleCost + inefficiencyCost;
    const revtrackCost = teamSize * 49;
    const revtrackTotal = totalPeopleCost + revtrackCost;
    const monthlySavings = inefficiencyCost + churnRecovery - revtrackCost;
    const annualSavings = monthlySavings * 12;
    return {
      totalPeopleCost, totalCommissions, hoursWasteCost, effectiveMgmtHours,
      errorCost, legalRiskMonthly, churnRecovery, inefficiencyCost,
      manualTotal, revtrackCost, revtrackTotal, monthlySavings, annualSavings,
      hoursFreed: mgmtHours,
      roi: revtrackCost > 0 ? (monthlySavings / revtrackCost) * 100 : 0,
    };
  }, [inputs]);

  const chartData = [
    { name: "Gestão Manual", value: Math.round(calc.manualTotal) },
    { name: "Com RevTrack", value: Math.round(calc.revtrackTotal) },
  ];

  function handleUnlock() {
    setIsUnlocked(true);
    setShowModal(false);
    setShowExitIntent(false);
  }

  function handleWhatsAppExit() {
    const url = buildWhatsAppUrl(inputs.teamSize, calc.inefficiencyCost);
    window.open(url, "_blank");
    setShowExitIntent(false);
    handleUnlock();
  }

  return (
    <div className="py-6 px-4 pb-10">
      {/* Intro */}
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-blue-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Time de Vendas</h2>
            </div>
            <Slider label="Tamanho do Time" value={inputs.teamSize} min={1} max={100} step={1}
              onChange={set("teamSize")} display={`${inputs.teamSize} vendedores`} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Regime de Contratação</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                {(["clt", "pj"] as const).map((r) => (
                  <button key={r} onClick={() => set("regime")(r)}
                    className={`flex-1 py-2 text-sm font-semibold transition-all ${inputs.regime === r ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <NumberInput label="Salário Base Médio (R$)" value={inputs.baseSalary} isCurrency onChange={set("baseSalary")} />
            <Slider label="Comissão Média" value={inputs.commissionPct} min={0} max={30} step={0.5}
              onChange={set("commissionPct")} display={`${inputs.commissionPct}%`}
              hint="Percentual sobre o volume de vendas individual" />
            {inputs.regime === "clt" && (
              <NumberInput label="Benefícios por Pessoa (VR+VA+Saúde)" value={inputs.benefits} isCurrency onChange={set("benefits")} />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 size={16} className="text-blue-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Operação e Ineficiência</h2>
            </div>
            <NumberInput label="Volume de Vendas Mensal (R$)" value={inputs.monthlySalesVolume} isCurrency onChange={set("monthlySalesVolume")} />
            <Slider label="Horas de Gestão por Mês" value={inputs.mgmtHours} min={1} max={100} step={1}
              onChange={set("mgmtHours")} display={`${inputs.mgmtHours}h`}
              hint="Horas gastas calculando comissões manualmente" />
            <NumberInput label="Custo/Hora do Gestor (R$)" value={inputs.managerHourlyRate} isCurrency suffix="/h" onChange={set("managerHourlyRate")} />
            <Slider label="Taxa de Erro Estimada" value={inputs.errorRate} min={0} max={10} step={0.1}
              onChange={set("errorRate")} display={`${inputs.errorRate.toFixed(1)}%`}
              hint="Média de mercado: 3% para gestão em planilhas" />
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* ✅ FREE: ROI Hero */}
          <motion.div
            key={calc.annualSavings}
            initial={{ opacity: 0.8, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
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

          {/* 🔒 GATED: Metric Cards + Legal Risk + Chart + Breakdown */}
          <div className="relative">
            {/* Blurred content (always rendered for structure) */}
            <div className={`space-y-6 transition-all duration-500 ${!isUnlocked ? "blur-sm pointer-events-none select-none" : ""}`}>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard icon={AlertTriangle} label="Custo de Erros / Mês" value={fmt(calc.errorCost)}
                  sub={inputs.regime === "clt" ? `${inputs.errorRate.toFixed(1)}% s/ comissões × 1.7× CLT` : `${inputs.errorRate.toFixed(1)}% sobre ${fmt(calc.totalCommissions)} em comissões`}
                  color="red" />
                <MetricCard icon={Clock} label="Custo de Horas / Mês" value={fmt(calc.hoursWasteCost)}
                  sub={inputs.regime === "clt" ? `${calc.effectiveMgmtHours.toFixed(0)}h (+20% complexidade CLT)` : `${inputs.mgmtHours}h × R$${inputs.managerHourlyRate}/h`}
                  color="yellow" />
                <MetricCard icon={DollarSign} label="Ineficiência Total / Mês" value={fmt(calc.inefficiencyCost)}
                  sub={inputs.regime === "clt" ? "Erros + horas + risco jurídico" : "Horas + erros em planilha"}
                  color="red" />
                <MetricCard icon={Shield} label="Plano RevTrack / Mês" value={fmt(calc.revtrackCost)}
                  sub={`R$ 49 × ${inputs.teamSize} vendedor${inputs.teamSize > 1 ? "es" : ""}`}
                  color="blue" />
              </div>

              {/* Alerta risco jurídico CLT */}
              {inputs.regime === "clt" && calc.legalRiskMonthly > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800 mb-0.5">Estimativa de Risco Jurídico (CLT)</p>
                    <p className="text-sm text-orange-700">
                      Inconsistências no cálculo de comissões geram reflexos em 13º, férias e verbas rescisórias.
                      Passivo potencial estimado:{" "}
                      <span className="font-bold">{fmt(calc.legalRiskMonthly)}/mês</span>{" "}
                      ({fmt(calc.legalRiskMonthly * 12)}/ano).
                    </p>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">Custo Operacional Comparativo / Mês</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={56} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      <Cell fill="#ef4444" />
                      <Cell fill="#3b82f6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Economia Mensal</p>
                    <p className="text-2xl font-bold text-green-600">{fmt(Math.max(0, calc.monthlySavings))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-medium mb-1">por mês</p>
                    <p className="text-sm text-green-500">{fmt(Math.max(0, calc.annualSavings))} / ano</p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">Composição de Custos</h3>
                <div className="space-y-3">
                  {[
                    { label: "Custo total com pessoal (encargos + comissão)", value: calc.totalPeopleCost, neutral: true },
                    { label: inputs.regime === "clt" ? "Horas de gestão (+20% reflexos CLT)" : "Horas de gestão desperdiçadas", value: calc.hoursWasteCost, bad: true },
                    { label: inputs.regime === "clt" ? `Erros s/ comissões (${fmt(calc.totalCommissions)}) × 1.7× CLT` : `Erros s/ comissões pagas (${fmt(calc.totalCommissions)})`, value: calc.errorCost, bad: true },
                    ...(inputs.regime === "clt" && calc.legalRiskMonthly > 0
                      ? [{ label: "Risco jurídico por inconsistência salarial (CLT)", value: calc.legalRiskMonthly, bad: true, neutral: false, good: false }]
                      : []),
                    { label: "Recuperação de Churn por Visibilidade (1% das vendas)", value: calc.churnRecovery, good: true },
                    { label: "Plano RevTrack (substituição completa)", value: calc.revtrackCost, good: true },
                  ].map(({ label, value, neutral, bad, good }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${neutral ? "bg-slate-300" : bad ? "bg-red-400" : "bg-blue-400"}`} />
                        <span className="text-sm text-slate-600">{label}</span>
                      </div>
                      <span className={`text-sm font-bold ${neutral ? "text-slate-700" : bad ? "text-red-600" : "text-blue-600"}`}>
                        {fmt(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gated overlay */}
            {!isUnlocked && <GatedOverlay onUnlock={() => setShowModal(true)} />}
          </div>

          {/* Problems eliminated — always visible */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-red-800 mb-3">O que a RevTrack elimina do seu processo:</p>
            <ul className="space-y-2">
              {[
                "Erros manuais e divergências de valores",
                "Horas perdidas com planilhas complexas",
                "Falta de transparência para os vendedores",
                "Riscos de auditoria e passivos trabalhistas",
                "Shadow Accounting (vendedores calculando por conta própria)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                  <X size={15} className="text-red-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => {
              const url = buildWhatsAppUrl(inputs.teamSize, calc.inefficiencyCost);
              window.open(url, "_blank");
            }}
            className="w-full bg-[#25D366] hover:bg-[#20b856] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors shadow-lg shadow-green-200"
          >
            <WhatsAppIcon />
            Quero Testar Grátis
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── Lead Modal ── */}
      {showModal && (
        <LeadModal
          onClose={() => setShowModal(false)}
          onUnlock={handleUnlock}
          calc={calc}
          inputs={inputs}
        />
      )}

      {/* ── Exit Intent Popup ── */}
      {showExitIntent && (
        <ExitIntentPopup
          onClose={() => setShowExitIntent(false)}
          onWhatsApp={handleWhatsAppExit}
          inefficiencyCost={calc.inefficiencyCost}
        />
      )}
    </div>
  );
}
