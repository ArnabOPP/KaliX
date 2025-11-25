"use client"

interface DashboardProps {
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

export default function Dashboard({ systemData }: DashboardProps) {
  return (
    <div className="space-y-4">
      {/* Time and Status */}
      <div className="border border-cyan-400/30 bg-card p-6 rounded-sm cyber-glow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 font-mono">{systemData.time}</div>
            <div className="text-xs text-muted-foreground mt-2">CURRENT TIME</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 font-mono">{systemData.cpu}%</div>
            <div className="text-xs text-muted-foreground mt-2">CPU USAGE</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 font-mono">{systemData.gpu}%</div>
            <div className="text-xs text-muted-foreground mt-2">GPU USAGE</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 font-mono">{systemData.memory}%</div>
            <div className="text-xs text-muted-foreground mt-2">MEMORY USAGE</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">CPU</span>
              <span className="text-cyan-400">{systemData.cpu}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className="h-full bg-cyan-400/70 transition-all duration-300"
                style={{ width: `${systemData.cpu}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">GPU</span>
              <span className="text-blue-400">{systemData.gpu}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className="h-full bg-blue-400/70 transition-all duration-300"
                style={{ width: `${systemData.gpu}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">MEMORY</span>
              <span className="text-purple-400">{systemData.memory}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className="h-full bg-purple-400/70 transition-all duration-300"
                style={{ width: `${systemData.memory}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">RAM</span>
              <span className="text-yellow-400">{systemData.ram}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
              <div
                className="h-full bg-yellow-400/70 transition-all duration-300"
                style={{ width: `${systemData.ram}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="border border-green-500/30 bg-card p-4 rounded-sm font-mono text-sm h-48 overflow-y-auto">
        <div className="text-green-500">
          <div>{">"} SYSTEM INITIALIZED</div>
          <div>{">"} SECURITY PROTOCOLS ACTIVE</div>
          <div>{">"} AI ASSISTANT READY</div>
          <div className="mt-4">
            {">"} <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  )
}
