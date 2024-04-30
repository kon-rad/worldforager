// const { createClient } = require("@deepgram/sdk")
import { createClient } from "@deepgram/sdk"
// const fs = require("fs")
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

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
    console.log(
      "inside /api/voice process.env.DEEPGRAM_API_KEY ->",
      process.env.DEEPGRAM_API_KEY
    )

    const { speakText } = await req.json()

    // STEP 1: Create a Deepgram client with your API key
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY)
    console.log("post deepgram createClient")

    // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = await deepgram.speak.request(
      { text: speakText },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    )
    console.log("post response")

    // STEP 3: Get the audio stream and headers from the response
    const stream = await response.getStream()
    console.log("post stream")
    const headers = await response.getHeaders()
    if (stream) {
      console.log("inside stream")

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
