"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import SystemMonitor from "@/components/system-monitor"
import PerformancePanel from "@/components/performance-panel"
import AnalyticsPanel from "@/components/analytics-panel"
import VoiceCommand from "@/components/voice-command"
import ProcessMonitor from "@/components/process-monitor"
import CommunicationPanel from "@/components/communication-panel"

interface SystemMetrics {
  time: string
  cpu: number
  gpu: number
  memory: number
  ram: number
  temp: number
  networkUp: number
  networkDown: number
  coordinates: { lat: number; lon: number }
}

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isListening, setIsListening] = useState(false)
  const [systemData, setSystemData] = useState<SystemMetrics>({
    time: new Date().toLocaleTimeString(),
    cpu: 35,
    gpu: 22,
    memory: 42,
    ram: 58,
    temp: 62,
    networkUp: 245,
    networkDown: 512,
    coordinates: { lat: 0, lon: 0 },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setSystemData((prev) => ({
        ...prev,
        time: new Date().toLocaleTimeString(),
      }))
    }, 1000)

    // Get user coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSystemData((prev) => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          }))
        },
        () => {
          // Default coordinates if geolocation fails
          setSystemData((prev) => ({
            ...prev,
            coordinates: { lat: 40.7128, lon: -74.006 },
          }))
        },
      )
    }

    const metricsInterval = setInterval(() => {
      setSystemData((prev) => {
        const cpuChange = (Math.random() - 0.5) * 3
        const newCpu = Math.max(20, Math.min(80, prev.cpu + cpuChange))

        const gpuChange = (Math.random() - 0.5) * 2.5
        const newGpu = Math.max(15, Math.min(70, prev.gpu + gpuChange))

        const ramChange = (Math.random() - 0.5) * 1.5
        const newRam = Math.max(45, Math.min(75, prev.ram + ramChange))

        const memoryChange = (Math.random() - 0.5) * 2
        const newMemory = Math.max(30, Math.min(70, prev.memory + memoryChange))

        const tempChange = (Math.random() - 0.5) * 1
        const newTemp = Math.max(58, Math.min(82, prev.temp + tempChange))

        const netUpChange = (Math.random() - 0.5) * 50
        const newNetUp = Math.max(150, Math.min(450, prev.networkUp + netUpChange))

        const netDownChange = (Math.random() - 0.5) * 100
        const newNetDown = Math.max(300, Math.min(750, prev.networkDown + netDownChange))

        return {
          ...prev,
          cpu: Math.round(newCpu * 10) / 10,
          gpu: Math.round(newGpu * 10) / 10,
          ram: Math.round(newRam * 10) / 10,
          memory: Math.round(newMemory * 10) / 10,
          temp: Math.round(newTemp * 10) / 10,
          networkUp: Math.round(newNetUp),
          networkDown: Math.round(newNetDown),
        }
      })
    }, 3000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background grid effect */}
      <div className="fixed inset-0 opacity-3 pointer-events-none">
        <div
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          className="absolute inset-0"
        />
      </div>

      <Header isListening={isListening} setIsListening={setIsListening} />

      <main className="relative z-10">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Top Status Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SystemMonitor label="CPU USAGE" value={systemData.cpu} unit="%" status="active" color="cyan" />
            <SystemMonitor label="GPU USAGE" value={systemData.gpu} unit="%" status="active" color="green" />
            <SystemMonitor label="MEMORY" value={systemData.memory} unit="%" status="active" color="blue" />
            <SystemMonitor
              label="SYSTEM TEMP"
              value={systemData.temp}
              unit="°C"
              status={systemData.temp > 75 ? "warning" : "active"}
              color="orange"
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Performance Panel */}
            <div className="lg:col-span-2">
              <PerformancePanel systemData={systemData} />
            </div>

            {/* System Info Sidebar */}
            <div className="space-y-4">
              <ProcessMonitor systemData={systemData} />
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <AnalyticsPanel systemData={systemData} />
          </div>

          {/* Communication Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <CommunicationPanel />
          </div>

          {/* Voice Command Panel */}
          <VoiceCommand isListening={isListening} systemData={systemData} />
        </div>
      </main>
    </div>
  )
}
