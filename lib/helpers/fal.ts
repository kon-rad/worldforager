import * as fal from "@fal-ai/serverless-client"

const generateVideoFromImage = async (imageUrl: any) => {
  try {
    console.log("calling fal image to video: ", imageUrl)

    const modelType: string = "animatediff-v2v"
    let result = ""
    if (modelType === "fast-svd-lcm") {
      result = await fal.subscribe("fal-ai/fast-svd-lcm", {
        input: {
          image_url: imageUrl,
        },
        logs: true,
        // onQueueUpdate: (update) => {
        //   if (update.status === "IN_PROGRESS") {
        //     update.logs.map((log) => log.message).forEach(console.log)
        //   }
        // },
      })
    } else if (modelType === "animatediff-v2v") {
      result = await fal.subscribe("fal-ai/animatediff-v2v", {
        input: {
          video_url:
            "https://storage.googleapis.com/falserverless/model_tests/animatediff_v2v/rocket.mp4",
          prompt:
            "masterpiece, best quality, rocket in space, galaxies in the background",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log)
          }
        },
      })
    }
    console.log("result", result)
    return result
  } catch (error) {}
}

export { generateVideoFromImage }
