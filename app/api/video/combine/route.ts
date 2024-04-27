import type { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"
import multer from "multer"
import ffmpeg from "fluent-ffmpeg"

export default handler
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "./helper"
import { generateVideoFromImage } from "@/lib/helpers/fal"

const upload = multer({ storage: multer.memoryStorage() })

export const POST = async (req: NextRequest): Promise<Response> => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" })
  }

  try {
    const files = req.files as Express.Multer.File[]

    // Process files with FFmpeg
    const command = ffmpeg()

    // Add each video to the FFmpeg command
    files.forEach((file, index) => {
      const filename = `input${index}.mp4`
      ffmpeg.FS("writeFile", filename, new Uint8Array(file.buffer))
      command.input(filename)
    })

    // Set the output options and execute the command
    command
      .mergeToFile("output.mp4", "/tmp")
      .on("error", function (err) {
        console.log("Error:", err)
        res.status(500).json({ error: "Failed to combine videos" })
      })
      .on("end", function () {
        console.log("Finished processing")
        res.status(200).sendFile("/tmp/output.mp4")
      })
  } catch (error) {
    console.error("Processing error:", error)
    res.status(500).json({ error: "Error processing videos" })
  }
  try {
    console.log("inside /api/video /generate")

    const { image_url } = await req.json()
    // console.log("Received base64 video :", target, source);

    if (image_url) {
      console.log("calling gen video: ")

      const resp = await generateVideoFromImage(image_url)
      console.log("response: ", resp)

      return new Response(JSON.stringify(resp))
    } else {
      return NextResponse.json(
        { response: "you must provide source and target images " },
        { status: 200 }
      )
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
