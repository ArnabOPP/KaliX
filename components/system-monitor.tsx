interface SystemMonitorProps {
  label: string
  value: number
  unit: string
  status: "active" | "warning" | "critical"
  color: "cyan" | "green" | "blue" | "orange" | "red"
}

const colorMap = {
  cyan: { text: "text-primary", bg: "bg-primary/10", bar: "bg-primary" },
  green: { text: "text-accent", bg: "bg-accent/10", bar: "bg-accent" },
  blue: { text: "text-blue-400", bg: "bg-blue-400/10", bar: "bg-blue-400" },
  orange: { text: "text-yellow-500", bg: "bg-yellow-500/10", bar: "bg-yellow-500" },
  red: { text: "text-destructive", bg: "bg-destructive/10", bar: "bg-destructive" },
}

const getStatusMessage = (label: string, value: number): "active" | "warning" | "critical" => {
  if (label.includes("TEMP")) {
    if (value > 80) return "critical"
    if (value > 70) return "warning"
  } else if (label.includes("CPU")) {
    if (value > 85) return "critical"
    if (value > 75) return "warning"
  } else if (label.includes("GPU")) {
    if (value > 80) return "critical"
    if (value > 70) return "warning"
  } else if (label.includes("MEMORY")) {
    if (value > 85) return "critical"
    if (value > 75) return "warning"
  }
  return "active"
}

export default function SystemMonitor({ label, value, unit, status, color }: SystemMonitorProps) {
  const colors = colorMap[color]
  const maxValue = label.includes("TEMP") ? 100 : 100
  const actualStatus = getStatusMessage(label, value)

  return (
    <div className="glow-card p-4 border rounded-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-mono text-muted-foreground font-semibold tracking-wider">{label}</div>
            <div className={`text-3xl font-bold font-mono mt-1 ${colors.text}`}>
              {value}
              <span className="text-lg ml-1 opacity-70">{unit}</span>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${colors.bg} border ${colors.text} border-opacity-50`} />
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-sm overflow-hidden border border-border/50">
          <div
            className={`h-full ${colors.bar} transition-all duration-500`}
            style={{ width: `${(value / maxValue) * 100}%` }}
          />
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-mono font-semibold uppercase tracking-wide ${colors.text}`}>{actualStatus}</span>
        </div>
      </div>
    </div>
  )
}
