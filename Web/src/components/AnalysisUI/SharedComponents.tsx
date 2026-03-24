import { ExternalLink } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "good" | "warning" | "critical";
  icon?: string;
}

export function KPICard({ label, value, unit, status = "good", icon }: KPICardProps) {
  const statusColors = {
    good: "border-green-500 bg-green-500/5",
    warning: "border-amber-500 bg-amber-500/5",
    critical: "border-red-500 bg-red-500/5",
  };

  return (
    <div className={`rounded-lg border ${statusColors[status]} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">
            {icon && <span className="mr-2">{icon}</span>}
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  text: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

export function Badge({ text, variant = "primary" }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-green-500/10 text-green-700 border border-green-500/20",
    warning: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-700 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-700 border border-blue-500/20",
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {text}
    </span>
  );
}

interface ExternalLinkBtnProps {
  url: string;
  text?: string;
  newTab?: boolean;
}

export function ExternalLinkBtn({ url, text = "Ver mais", newTab = true }: ExternalLinkBtnProps) {
  return (
    <a
      href={url}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
    >
      {text}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

interface SectionTitleProps {
  emoji: string;
  title: string;
  description?: string;
}

export function SectionTitle({ emoji, title, description }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
        <span className="text-3xl">{emoji}</span>
        {title}
      </h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  status?: "good" | "warning" | "critical";
}

export function ProgressBar({ value, max = 100, label, status = "good" }: ProgressBarProps) {
  const colors = {
    good: "bg-green-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  };

  const percentage = (value / max) * 100;

  return (
    <div>
      {label && <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${colors[status]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  emoji?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, emoji, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      {(title || emoji) && (
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          {emoji && <span className="text-xl">{emoji}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface ImpactIndicatorProps {
  level: "high" | "medium" | "low";
  showLabel?: boolean;
}

export function ImpactIndicator({ level, showLabel = true }: ImpactIndicatorProps) {
  const colors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  };

  const labels = {
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[level]}`} />
      {showLabel && <span className="text-sm font-medium">{labels[level]}</span>}
    </div>
  );
}
