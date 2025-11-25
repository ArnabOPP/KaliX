import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type SignalMessage =
  | { type: "offer"; sdp: RTCSessionDescriptionInit }
  | { type: "answer"; sdp: RTCSessionDescriptionInit }
  | { type: "candidate"; candidate: RTCIceCandidateInit }
  | { type: "end" }

export interface PeerCallState {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  inCall: boolean
  videoOn: boolean
  audioOn: boolean
  screenSharing: boolean
  messages: { id: string; sender: "local" | "remote"; text: string; timestamp: number }[]
}

export function usePeerCall(roomId: string) {
  const channelName = useMemo(() => `comm-center-${roomId}`, [roomId])
  const signalChannelRef = useRef<BroadcastChannel | null>(null)
  const signalChannelNameRef = useRef<string | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<PeerCallState>({
    localStream: null,
    remoteStream: null,
    inCall: false,
    videoOn: false,
    audioOn: true,
    screenSharing: false,
    messages: [],
  })

  const reset = useCallback(() => {
    dcRef.current?.close()
    dcRef.current = null
    pcRef.current?.getSenders().forEach((s) => s.track?.stop())
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    remoteStreamRef.current = null
    setState((s) => ({ ...s, localStream: null, remoteStream: null, inCall: false, videoOn: false, screenSharing: false }))
  }, [])

  const ensureSignal = useCallback(() => {
    if (!signalChannelRef.current || signalChannelNameRef.current !== channelName) {
      signalChannelRef.current?.close()
      signalChannelRef.current = new BroadcastChannel(channelName)
      signalChannelNameRef.current = channelName
      signalChannelRef.current.onmessage = async (ev) => {
        const msg = ev.data as SignalMessage
        if (msg.type === "offer") {
          if (!pcRef.current) await createPeer(false)
          if (!pcRef.current) return
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          const answer = await pcRef.current.createAnswer()
          await pcRef.current.setLocalDescription(answer)
          signalChannelRef.current?.postMessage({ type: "answer", sdp: answer } satisfies SignalMessage)
        } else if (msg.type === "answer") {
          if (!pcRef.current) return
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        } else if (msg.type === "candidate") {
          if (!pcRef.current) return
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate))
          } catch {}
        } else if (msg.type === "end") {
          reset()
        }
      }
    }
  }, [channelName, reset])

  const createPeer = useCallback(
    async (initiator: boolean) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
        ],
      })
      pcRef.current = pc

      pc.onicecandidate = (e) => {
        if (e.candidate) signalChannelRef.current?.postMessage({ type: "candidate", candidate: e.candidate.toJSON() } satisfies SignalMessage)
      }

      pc.ontrack = (e) => {
        const stream = remoteStreamRef.current ?? new MediaStream()
        remoteStreamRef.current = stream
        e.streams[0]?.getTracks().forEach((t) => stream.addTrack(t))
        setState((s) => ({ ...s, remoteStream: stream }))
      }

      pc.ondatachannel = (e) => {
        dcRef.current = e.channel
        dcRef.current.onmessage = (evt) => {
          const text = String(evt.data)
          setState((s) => ({
            ...s,
            messages: [...s.messages, { id: `${Date.now()}`, sender: "remote", text, timestamp: Date.now() }],
          }))
        }
      }

      if (initiator) {
        dcRef.current = pc.createDataChannel("chat")
        dcRef.current.onmessage = (evt) => {
          const text = String(evt.data)
          setState((s) => ({
            ...s,
            messages: [...s.messages, { id: `${Date.now()}`, sender: "remote", text, timestamp: Date.now() }],
          }))
        }
      }

      const constraints: MediaStreamConstraints = { audio: true, video: true }
      const local = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = local
      setState((s) => ({ ...s, localStream: local, videoOn: true, audioOn: true }))
      local.getTracks().forEach((t) => pc.addTrack(t, local))

      return pc
    },
    []
  )

  const startCall = useCallback(async () => {
    ensureSignal()
    const pc = await createPeer(true)
    setState((s) => ({ ...s, inCall: true }))
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    signalChannelRef.current?.postMessage({ type: "offer", sdp: offer } satisfies SignalMessage)
  }, [createPeer, ensureSignal])

  const endCall = useCallback(() => {
    signalChannelRef.current?.postMessage({ type: "end" } satisfies SignalMessage)
    reset()
  }, [reset])

  const toggleAudio = useCallback(() => {
    const local = localStreamRef.current
    if (!local) return
    const next = !state.audioOn
    local.getAudioTracks().forEach((t) => (t.enabled = next))
    setState((s) => ({ ...s, audioOn: next }))
  }, [state.audioOn])

  const toggleVideo = useCallback(() => {
    const local = localStreamRef.current
    if (!local) return
    const next = !state.videoOn
    local.getVideoTracks().forEach((t) => (t.enabled = next))
    setState((s) => ({ ...s, videoOn: next }))
  }, [state.videoOn])

  const startScreenShare = useCallback(async () => {
    const pc = pcRef.current
    if (!pc) return
    const display = await navigator.mediaDevices.getDisplayMedia({ video: true })
    const screenTrack = display.getVideoTracks()[0]
    const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video")
    if (sender) sender.replaceTrack(screenTrack)
    setState((s) => ({ ...s, screenSharing: true }))
    screenTrack.onended = () => stopScreenShare()
  }, [])

  const stopScreenShare = useCallback(() => {
    const pc = pcRef.current
    const local = localStreamRef.current
    if (!pc || !local) return
    const camTrack = local.getVideoTracks()[0]
    const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video")
    if (sender && camTrack) sender.replaceTrack(camTrack)
    setState((s) => ({ ...s, screenSharing: false }))
  }, [])

  const sendMessage = useCallback((text: string) => {
    const ch = dcRef.current
    if (!ch || !text.trim()) return
    ch.send(text)
    setState((s) => ({
      ...s,
      messages: [...s.messages, { id: `${Date.now()}`, sender: "local", text, timestamp: Date.now() }],
    }))
  }, [])

  useEffect(() => {
    ensureSignal()
    return () => {
      signalChannelRef.current?.close()
      signalChannelRef.current = null
      signalChannelNameRef.current = null
      reset()
    }
  }, [ensureSignal, reset])

  return {
    state,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    sendMessage,
  }
}

