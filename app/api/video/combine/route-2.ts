import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: any): Promise<Response> => {
  try {
    const { videoUrls } = req.body
    const ffmpeg = createFFmpeg({ log: true })

    async function combineVideos(videoPaths: string[]): Promise<string> {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
      }

      // Load video files into ffmpeg's filesystem
      await Promise.all(
        videoPaths.map(async (videoPath, i) => {
          ffmpeg.FS("writeFile", `input${i}.mp4`, await fetchFile(videoPath))
        })
      )

      // Generate a text file with input file list for concatenation
      const concatFileContent = videoPaths
        .map((_, index) => `file 'input${index}.mp4'`)
        .join("\n")
      ffmpeg.FS("writeFile", "input.txt", concatFileContent)

      // Run the ffmpeg command to concatenate videos
      await ffmpeg.run(
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "input.txt",
        "-c",
        "copy",
        "output.mp4"
      )

      // Fetch the resulting video file
      const data = ffmpeg.FS("readFile", "output.mp4")

      // Create a Blob URL to download or play the video
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" })
      const videoUrl = URL.createObjectURL(videoBlob)

      return videoUrl
    }

    // Usage example
    const videoPaths = videoUrls
    const videoUrl = await combineVideos(videoPaths)

    console.log("Videos combined successfully!")
    console.log("videoUrl", videoUrl)

    return new Response(JSON.stringify({ videoUrl }))
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
  }
}
