import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { handleCloudinaryUpload } from "./cloud"

async function downloadVideo(url: string) {
  const response = await axios.get(url, { responseType: "stream" })
  return response.data
}
export const POST = async (req: any): Promise<Response> => {
  try {
    const { videoUrls } = req.body

    if (!videoUrls || videoUrls.length === 0) {
      return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
    }
    const resp = handleCloudinaryUpload(videoUrls, "wfvideo")
    console.log("resp: ", resp)

    return new Response(JSON.stringify("/tmp/output.mp4"))
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
  }
}
