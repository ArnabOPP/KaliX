import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are KALI, an elite AI assistant for a professional cybersecurity and hacking interface. You are sophisticated, professional, and speak with military-grade precision. Keep responses concise (1-2 sentences maximum). Always reference specific data points and use technical terminology. Format responses for audio playback - be clear and avoid complex punctuation.`,
      prompt: message,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("AI Error:", error)
    return Response.json({ response: "Error processing command" }, { status: 500 })
  }
}
