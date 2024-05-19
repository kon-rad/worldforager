import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { handleCloudinaryUpload } from "./cloud"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})
const audionarration = "audionarration"
const uploadedfinal = ["clwcd73qb000aixvxr5tr7qkv", "clwcd6qn60008ixvxt99h9ghf"]

async function downloadVideo(url: string) {
  const response = await axios.get(url, { responseType: "stream" })
  return response.data
}
export const POST = async (req: any): Promise<Response> => {
  try {
    // const { videoUrls } = req.body
    const { videoUrls, audioSrc } = await req.json()

    if (!videoUrls || videoUrls.length === 0) {
      return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
    }

    const uploadedVideos = []
    // Upload each video URL to Cloudinary
    for (const videoUrl of videoUrls) {
      if (!(videoUrl.id in uploadedfinal)) {
        const result = await cloudinary.uploader.upload(videoUrl.url, {
          resource_type: "video", // Ensure the resource type is set to video
          public_id: videoUrl.publicId,
        })
        console.log(`Uploaded video with public ID: ${result.public_id}`)
        uploadedVideos.push(result.public_id)
      }
    }
    if (audioSrc) {
      const result = await cloudinary.uploader.upload(audioSrc, {
        resource_type: "video", // Ensure the resource type is set to video
        public_id: audionarration,
      })
      console.log(
        `Uploaded audioSrc with public ID: ${result.public_id}`,
        audioSrc
      )
      uploadedVideos.push(result.public_id)
    }

    // You can combine videos here using Cloudinary's video transformation features
    // Refer to Cloudinary documentation for combining videos: https://cloudinary.com/documentation/video_manipulation_and_delivery#concatenate_videos

    // const resp = await handleCloudinaryUpload("/", videoUrls)
    // console.log("resp: ", resp)
    if (uploadedVideos.length >= 2) {
      const transformations = []

      // transformations.push(
      //   { audio_codec: "none" },
      //   { overlay: `audio:${audionarration}` },
      //   { flags: "layer_apply" }
      // )
      for (let i = 0; i < uploadedVideos.length; i++) {
        transformations.push(
          { height: 512, width: 512, crop: "fill" },
          { flags: "splice", overlay: `video:${uploadedVideos[i]}` }
        )
      }

      transformations.push({ height: 512, width: 512, crop: "" })
      transformations.push({ flags: "layer_apply" })

      // Apply the audio overlay after all video overlays
      transformations.push(
        { audio_codec: "none" },
        { overlay: `audio:${audionarration}` },
        { flags: "layer_apply" }
      )
      const combinedVideo = cloudinary.video(uploadedVideos[0], {
        transformation: transformations,
      })

      return NextResponse.json({
        message: "Videos combined successfully",
        combinedVideo,
      })
    }

    return new Response(JSON.stringify("/tmp/output.mp4"))
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "missing videoUrls" }, { status: 500 })
  }
}
