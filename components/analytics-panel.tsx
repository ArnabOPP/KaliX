"use client"

interface AnalyticsPanelProps {
  systemData: {
    cpu: number
    gpu: number
    temp: number
  }
}

export default function AnalyticsPanel({ systemData }: AnalyticsPanelProps) {
  return (
    <div className="glow-card border p-6 rounded-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary font-mono tracking-wider">SYSTEM DIAGNOSTICS</h2>
        <p className="text-xs text-muted-foreground mt-1">Real-time performance analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Diagnostics */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">CPU Analysis</div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Core Usage</span>
              <span className="text-primary font-mono font-bold">{systemData.cpu}%</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-2">8/16 Cores Active</div>
        </div>

        {/* GPU Diagnostics */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">GPU Analysis</div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">GPU Load</span>
              <span className="text-accent font-mono font-bold">{systemData.gpu}%</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${systemData.gpu}%` }} />
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-2">NVIDIA RTX 4090</div>
        </div>

        {/* Thermal Management */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Thermal</div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Temp</span>
              <span className={`font-mono font-bold ${systemData.temp > 75 ? "text-destructive" : "text-accent"}`}>
                {systemData.temp}°C
              </span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${systemData.temp > 75 ? "bg-destructive" : "bg-accent"}`}
                style={{ width: `${(systemData.temp / 100) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-2">{systemData.temp > 75 ? "⚠️ High" : "✓ Optimal"}</div>
        </div>
      </div>
    </div>
  )
}
