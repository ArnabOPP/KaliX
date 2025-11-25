"use client"

interface ProcessMonitorProps {
  systemData: {
    temp: number
    ram: number
    coordinates: { lat: number; lon: number }
  }
}

export default function ProcessMonitor({ systemData }: ProcessMonitorProps) {
  return (
    <div className="space-y-4">
      {/* Temperature */}
      <div className="glow-card border p-4 rounded-sm">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-3">
          System Temperature
        </div>
        <div className="text-3xl font-bold font-mono mb-2">
          <span className={systemData.temp > 75 ? "text-destructive" : "text-accent"}>{systemData.temp}°C</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${systemData.temp > 75 ? "bg-destructive" : "bg-accent"}`}
            style={{ width: `${(systemData.temp / 100) * 100}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Status: {systemData.temp > 75 ? "⚠️ WARNING" : "✓ NORMAL"}
        </div>
      </div>

      {/* Location */}
      <div className="glow-card border p-4 rounded-sm">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-3">
          Coordinates
        </div>
        <div className="space-y-1">
          <div className="font-mono text-sm">
            <span className="text-muted-foreground">LAT: </span>
            <span className="text-primary">{systemData.coordinates.lat.toFixed(4)}°</span>
          </div>
          <div className="font-mono text-sm">
            <span className="text-muted-foreground">LON: </span>
            <span className="text-accent">{systemData.coordinates.lon.toFixed(4)}°</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="glow-card border p-4 rounded-sm">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-3">
          System Status
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Encryption:</span>
            <span className="text-accent">✓ ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Firewall:</span>
            <span className="text-accent">✓ ENABLED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Threat Detection:</span>
            <span className="text-accent">✓ ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Network Security:</span>
            <span className="text-green-400">✓ SECURE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
