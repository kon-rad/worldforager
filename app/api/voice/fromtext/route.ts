// const { createClient } = require("@deepgram/sdk")
import { createClient } from "@deepgram/sdk"
// const fs = require("fs")
import { NextRequest, NextResponse } from "next/server"
import * as AWS from "aws-sdk"
import { createGenerated } from "@/lib/database/generated"

export const maxDuration = 30 // This function can run for a maximum of 60 seconds

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
})

const s3 = new AWS.S3()

async function saveStreamToS3(
  stream: NodeJS.ReadableStream,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: fileName,
    Body: stream,
    ContentType: "audio/wav",
  }

  try {
    await s3.upload(params).promise()
    return `https://${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com/${fileName}`
  } catch (error) {
    console.error("Error saving to S3:", error)
    throw error
  }
}

// helper function to convert stream to audio buffer
// const getAudioBuffer = async (response) => {
//   const reader = response.getReader()
//   const chunks = []

//   while (true) {
//     const { done, value } = await reader.read()
//     if (done) break

//     chunks.push(value)
//   }

//   const dataArray = chunks.reduce(
//     (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
//     new Uint8Array(0)
//   )

//   return Buffer.from(dataArray.buffer)
// }

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

    const stream = await response.getStream()
    if (stream) {
      const fileName = `audio-${Date.now()}.wav`
      const fileUrl = await saveStreamToS3(stream, fileName)
      // save to db

      console.log("fileUrl: audio ", fileUrl)
      const resp = await createGenerated({
        userId: "123",
        type: "scriptaudio",
        url: fileUrl,
        prompt: speakText,
        studioId: "4242",
      })
      console.log("saved db resp ", resp)

      return new Response(JSON.stringify({ url: fileUrl }), {
        headers: { "Content-Type": "application/json" },
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
