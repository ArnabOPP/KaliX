"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, Mic } from "lucide-react"

interface VoiceCommandProps {
  isListening: boolean
  systemData: any
}

export default function VoiceCommand({ isListening, systemData }: VoiceCommandProps) {
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("Ready to receive commands...")
  const [commandHistory, setCommandHistory] = useState<Array<{ time: string; command: string }>>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setResponse("Speech Recognition API not available in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setTranscript("")
      setResponse("LISTENING FOR COMMANDS...")
    }

    recognition.onresult = (event: any) => {
      let current = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript + " "
      }
      setTranscript(current.trim())

      if (event.results[event.results.length - 1].isFinal) {
        const finalCommand = current.trim()
        if (finalCommand) {
          processCommand(finalCommand)
        }
      }
    }

    recognition.onerror = (event: any) => {
      setResponse(`ERROR: ${event.error ? event.error.toUpperCase() : "Unknown error"}`)
    }

    recognition.onend = () => {
      // Auto-restart if still should be listening
      if (isListening) {
        try {
          recognition.start()
        } catch (e) {
          console.log("[v0] Recognition already started")
        }
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.log("[v0] Recognition start error:", e)
    }

    return () => {
      try {
        recognition.stop()
      } catch (e) {
        console.log("[v0] Recognition stop error:", e)
      }
    }
  }, [isListening])

  const processCommand = async (command: string) => {
    setIsProcessing(true)
    setResponse("PROCESSING THROUGH SECURITY PROTOCOLS...")

    try {
      const aiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `User command in cybersecurity interface: "${command}". Current system stats: CPU ${systemData.cpu}%, GPU ${systemData.gpu}%, RAM ${systemData.ram}%, Temp ${systemData.temp}°C, Network Up ${systemData.networkUp} Mbps, Down ${systemData.networkDown} Mbps. User coordinates: ${systemData.coordinates.lat.toFixed(2)}°N, ${systemData.coordinates.lon.toFixed(2)}°E. Respond as KALI AI assistant.`,
        }),
      }).then((res) => res.json())

      const finalResponse = aiResponse.response || "Command acknowledged"

      setResponse(finalResponse)
      setCommandHistory((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          command: command,
        },
        ...prev.slice(0, 9),
      ])

      speakResponse(finalResponse)
    } catch (error) {
      console.log("[v0] Processing error:", error)
      setResponse("ERROR: Unable to process command")
      setIsProcessing(false)
    }
  }

  const speakResponse = (text: string) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = "en-US"

      // Get best available voice
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        // Try to find a professional-sounding male voice
        const maleVoice =
          voices.find((v) => v.name.includes("Google UK English Male")) ||
          voices.find((v) => !v.name.includes("Female")) ||
          voices[0]
        utterance.voice = maleVoice
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        console.log("[v0] Speech synthesis started for:", text.substring(0, 50))
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsProcessing(false)
        console.log("[v0] Speech synthesis completed")
      }

      utterance.onerror = (event: any) => {
        console.log("[v0] Speech synthesis error:", event.error)
        setIsSpeaking(false)
        setIsProcessing(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.log("[v0] Voice synthesis error:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="glow-card border border-border/50 p-6 rounded-sm bg-background/40 backdrop-blur">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Volume2 className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-lg font-bold text-primary font-mono tracking-widest">VOICE COMMAND CENTER</h2>
          {(isSpeaking || isProcessing) && (
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">AI Assistant Communication Protocol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input/Output */}
        <div className="space-y-4">
          <div className="border border-border/50 bg-muted/20 p-4 rounded-sm min-h-24 backdrop-blur-sm">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
              <Mic className="w-3 h-3" />
              INPUT STREAM
            </div>
            <p className={`font-mono text-sm leading-relaxed ${transcript ? "text-primary" : "text-muted-foreground"}`}>
              {transcript || "Awaiting voice input..."}
            </p>
          </div>

          <div className="border border-border/50 bg-muted/20 p-4 rounded-sm min-h-24 backdrop-blur-sm">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-2">
              OUTPUT STREAM
            </div>
            <p className="font-mono text-sm leading-relaxed text-accent">
              {response}
              {isProcessing && <span className="animate-pulse">█</span>}
            </p>
          </div>
        </div>

        {/* Command History */}
        <div className="border border-border/50 bg-muted/20 p-4 rounded-sm backdrop-blur-sm">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold mb-3">
            Command History
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
            {commandHistory.length === 0 ? (
              <p className="text-muted-foreground text-xs font-mono">{">"} No commands processed yet</p>
            ) : (
              commandHistory.map((cmd, idx) => (
                <div key={idx} className="text-xs border-l border-primary/20 pl-3 py-1">
                  <div className="text-primary/70 font-mono">[{cmd.time}]</div>
                  <div className="text-foreground font-mono text-primary">{cmd.command}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
