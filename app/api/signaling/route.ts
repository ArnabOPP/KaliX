const subscribers: Set<ReadableStreamDefaultController> = new Set()

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      subscribers.add(controller)
      // Initial hello to open the stream
      controller.enqueue(new TextEncoder().encode(`event: open\ndata: "ok"\n\n`))
      const ping = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`event: ping\ndata: ${Date.now()}\n\n`))
        } catch {}
      }, 25000)
      ;(controller as any)._ping = ping
    },
    cancel() {},
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payload = JSON.stringify(body)
    const data = new TextEncoder().encode(`data: ${payload}\n\n`)
    subscribers.forEach((c) => {
      try {
        c.enqueue(data)
      } catch {}
    })
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 400 })
  }
}

