import * as fal from "@fal-ai/serverless-client"

const generateVideoFromImage = async (imageUrl: any) => {
  try {
    console.log("calling fal image to video: ", imageUrl)

    const result = await fal.subscribe("fal-ai/fast-svd-lcm", {
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
    console.log("result", result)
    return result
  } catch (error) {}
}

export { generateVideoFromImage }
