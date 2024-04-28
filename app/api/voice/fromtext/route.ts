const { createClient } = require("@deepgram/sdk")
const fs = require("fs")
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response) => {
  const reader = response.getReader()
  const chunks = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  )

  return Buffer.from(dataArray.buffer)
}

export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    console.log("inside /api/voice")

    const { speakText } = await req.json()

    // STEP 1: Create a Deepgram client with your API key
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY)

    // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = await deepgram.speak.request(
      { text: speakText },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    )
    // STEP 3: Get the audio stream and headers from the response
    const stream = await response.getStream()
    const headers = await response.getHeaders()
    if (stream) {
      // Convert the stream to an audio buffer
      const buffer = await getAudioBuffer(stream)

      // Return the audio buffer as a response
      return new Response(buffer, {
        headers: {
          "Content-Type": "audio/wav",
        },
      })
    } else {
      console.error("Error generating audio:", stream)
      return new Response(JSON.stringify({ error: "Error generating audio" }), {
        status: 500,
      })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
