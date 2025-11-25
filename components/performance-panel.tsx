"use client"

interface PerformancePanelProps {
  systemData: {
    time: string
    cpu: number
    gpu: number
    memory: number
    ram: number
    temp: number
    networkUp: number
    networkDown: number
  }
}

export default function PerformancePanel({ systemData }: PerformancePanelProps) {
  return (
    <div className="glow-card border p-6 rounded-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary font-mono tracking-wider">PERFORMANCE METRICS</h2>
          <p className="text-xs text-muted-foreground mt-1">Real-time system analysis</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-primary">{systemData.time}</div>
          <div className="text-xs text-muted-foreground">Current Time</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* CPU */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">CPU Load</div>
          <div className="text-3xl font-bold font-mono text-primary">{systemData.cpu}%</div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${systemData.cpu}%` }} />
          </div>
        </div>

        {/* GPU */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">GPU Load</div>
          <div className="text-3xl font-bold font-mono text-accent">{systemData.gpu}%</div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${systemData.gpu}%` }} />
          </div>
        </div>

        {/* RAM */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
            RAM Usage
          </div>
          <div className="text-3xl font-bold font-mono text-blue-400">{systemData.ram}%</div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${systemData.ram}%` }} />
          </div>
        </div>

        {/* Memory */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">Memory</div>
          <div className="text-3xl font-bold font-mono text-yellow-500">{systemData.memory}%</div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${systemData.memory}%` }}
            />
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="border-t border-border/50 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-2">
              Network Upload
            </div>
            <div className="text-2xl font-bold font-mono text-primary">{systemData.networkUp} MB/s</div>
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-2">
              Network Download
            </div>
            <div className="text-2xl font-bold font-mono text-accent">{systemData.networkDown} MB/s</div>
          </div>
        </div>
      </div>
    </div>
  )
}
