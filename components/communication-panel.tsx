"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { usePeerCall } from "@/hooks/use-peer-call"
import { Phone, PhoneOff, Video, VideoOff, Share2, Share, MessageSquare, Send, Users, Clock } from "lucide-react"

export interface Contact {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  status: "online" | "offline" | "busy"
  avatar: string
  department?: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: string
  isUser: boolean
}

export default function CommunicationPanel() {
  const { userContacts, user } = useAuth()
  const [activeTab, setActiveTab] = useState<"contacts" | "chat" | "call">("contacts")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")

  const roomId = useMemo(() => {
    if (!user || !selectedContact) return "idle"
    const pair = [user.email, selectedContact.email].sort().join("|")
    return pair
  }, [user, selectedContact])

  const selfId = user?.email || ""
  const { state, startCall, endCall, toggleAudio, toggleVideo, startScreenShare, stopScreenShare, sendMessage } = usePeerCall(roomId, selfId)

  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      ;(localVideoRef.current as any).srcObject = state.localStream
      localVideoRef.current.muted = true
      localVideoRef.current.play().catch(() => {})
    }
  }, [state.localStream])

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream) {
      ;(remoteVideoRef.current as any).srcObject = state.remoteStream
      remoteVideoRef.current.play().catch(() => {})
    }
  }, [state.remoteStream])

  const beginCall = (contact: Contact) => {
    setSelectedContact(contact)
    setActiveTab("call")
    startCall()
  }

  const finishCall = () => {
    endCall()
    setSelectedContact(null)
  }

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput)
      setChatInput("")
    }
  }

  return (
    <div className="glow-card border rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-primary tracking-wider">COMM CENTER</h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{userContacts.length} CONTACTS | SECURE</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-border">
        {(["contacts", "chat", "call"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono font-semibold transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Contacts Tab - Show personalized contacts from database */}
      {activeTab === "contacts" && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {userContacts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm font-mono">NO CONTACTS AVAILABLE</div>
          ) : (
            userContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded hover:border-primary/50 hover:bg-secondary/50 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded border border-primary/30 flex items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                    {contact.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-mono font-semibold text-foreground">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          contact.status === "online"
                            ? "bg-accent"
                            : contact.status === "busy"
                              ? "bg-destructive"
                              : "bg-muted-foreground"
                        }`}
                      />
                      {contact.status.toUpperCase()} | {contact.department}
                    </div>
                    {contact.phone && (
                      <div className="text-xs text-primary mt-1 font-mono">
                        <span className="text-accent">📞</span> {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => beginCall(contact)}
                    className="p-1.5 bg-primary/20 border border-primary/50 rounded hover:bg-primary/30 text-primary transition-colors"
                    title="Voice Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContact(contact)
                      setActiveTab("chat")
                    }}
                    className="p-1.5 bg-accent/20 border border-accent/50 rounded hover:bg-accent/30 text-accent transition-colors"
                    title="Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="flex flex-col h-80">
          {/* Chat Header */}
          {selectedContact && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <div className="w-6 h-6 rounded border border-accent/30 flex items-center justify-center bg-accent/10 text-xs font-bold text-accent">
                {selectedContact.avatar}
              </div>
              <div>
                <div className="text-sm font-mono font-semibold text-foreground">{selectedContact.name}</div>
                <div className="text-xs text-muted-foreground">SECURE MESSAGE CHANNEL</div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto mb-4 bg-background/50 p-3 rounded border border-border/50">
            {state.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "local" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded text-xs font-mono ${
                    msg.sender === "local"
                      ? "bg-primary/20 border border-primary/50 text-foreground"
                      : "bg-secondary/50 border border-border text-foreground"
                  }`}
                >
                  {msg.sender !== "local" && <div className="text-primary/80 text-xs mb-1">REMOTE</div>}
                  <div>{msg.text}</div>
                  <div className="text-muted-foreground text-xs mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type message..."
              className="flex-1 px-3 py-2 bg-input border border-border rounded text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 bg-primary/20 border border-primary/50 rounded hover:bg-primary/30 text-primary transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Call Tab */}
          {activeTab === "call" && (
            <div className="space-y-4">
          {state.inCall && selectedContact ? (
            <div className="space-y-4">
              {/* Call Info */}
              <div className="p-4 bg-secondary/50 border border-primary/30 rounded text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono">CALL ACTIVE</span>
                </div>
                <div className="text-xl font-bold text-primary">{selectedContact.name}</div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">00:45</span>
                </div>
              </div>

              {/* Video Preview */}
              {state.videoOn && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="aspect-video bg-black border-2 border-primary/50 rounded overflow-hidden relative">
                    <video ref={localVideoRef} className="w-full h-full object-cover" playsInline />
                  </div>
                  {state.remoteStream && (
                    <div className="aspect-video bg-black border-2 border-primary/50 rounded overflow-hidden relative">
                      <video ref={remoteVideoRef} className="w-full h-full object-cover" playsInline />
                    </div>
                  )}
                </div>
              )}

              {/* Screen Share Preview */}
              {state.screenSharing && (
                <div className="aspect-video bg-black border-2 border-accent/50 rounded flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
                  <div className="text-center">
                    <Share2 className="w-8 h-8 text-accent/50 mx-auto mb-2" />
                    <span className="text-xs text-accent/50 font-mono">SCREEN SHARING</span>
                  </div>
                </div>
              )}

              {/* Call Controls */}
              <div className="flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => toggleAudio()}
                  className={`p-2 rounded border transition-all ${
                    state.audioOn
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-destructive/20 border-destructive text-destructive"
                  }`}
                  title={state.audioOn ? "Mute" : "Unmute"}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleVideo()}
                  className={`p-2 rounded border transition-all ${
                    state.videoOn
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground"
                  }`}
                  title={state.videoOn ? "Stop Video" : "Start Video"}
                >
                  {state.videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => (state.screenSharing ? stopScreenShare() : startScreenShare())}
                  className={`p-2 rounded border transition-all ${
                    state.screenSharing
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-secondary border-border text-muted-foreground"
                  }`}
                  title={state.screenSharing ? "Stop Sharing" : "Share Screen"}
                >
                  {state.screenSharing ? <Share className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={finishCall}
                  className="p-2 rounded border bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30 transition-all"
                  title="End Call"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <Phone className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <div className="text-sm text-muted-foreground font-mono">NO ACTIVE CALL</div>
              <div className="text-xs text-muted-foreground">Select a contact to initiate communication</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
