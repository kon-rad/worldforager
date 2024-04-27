"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import UserImage from "./UserImage"
import SwappedImagesDisplay from "./SwappedImagesDisplay"
import { useS3Upload } from "next-s3-upload"
import { useToast } from "@/components/ui/use-toast"
import { createGenerated } from "@/lib/database/generated"
import { useGlobalState } from "@/context/GlobalState"
import IntermediateSteps from "./IntermediateSteps"
import {
  generateScript,
  generateImagePrompts,
  genImageStory,
  genImagePrompt,
} from "@/lib/helpers/gemini"
import { generateImage } from "@/lib/helpers/togetherai"
import GeneratedImages from "./GeneratedImages"

const userId = "123"

const ImageGen = ({ userImagesGen }: any) => {
  const [imagesResults, setImagesResults] = useState([])
  const [faceSwappedImage, setFaceSwappedImage] = useState()
  const [prompt, setPrompt] = useState("")
  const [characterPrompt, setCharacterPrompt] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null) // New state for storing selected image
  const [previewSource, setPreviewSource] = useState("")
  const { uploadToS3, files } = useS3Upload()
  const { toast } = useToast()
  const {
    characterDesc,
    setCharacterDesc,
    filmPlot,
    setFilmPlot,
    genScript,
    setGenScript,
    genImagePrompts,
    setGenImagePrompts,
    genImages,
    setGenImages,
    genVideos,
    setGenVideos,
  } = useGlobalState()

  const saveImagesToS3 = async (
    images: any,
    saveType: string,
    prompt: string,
    imageNumOfSeries: number
  ) => {
    for (const { image_base64 } of images) {
      const blob = await (await fetch(image_base64)).blob()
      const file = new File([blob], "image.jpeg", { type: "image/jpeg" })
      const { url } = await uploadToS3(file)

      if (saveType === "generated") {
        await createGenerated({
          url: url,
          userId: userId,
          prompt: prompt,
        })
      }
      toast({
        title: "Successfully saved image!",
      })
    }
  }
  // New function for handling image selection
  const selectImage = (image) => {
    setSelectedImage(image)
  }
  const generateCaption = async () => {
    console.log("Generating caption based on prompt:", prompt)
    if (!prompt) {
      alert("Please enter a prompt for the caption generation.")
      return
    }

    try {
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
              {
                role: "user",
                content: `Q: Generate a witty Instagram caption of an image that is generated from this prompt: ${prompt}\nA:`,
              },
            ],
            temperature: 0.8,
            max_tokens: 60,
          }),
        }
      )
      console.log("response", response)

      if (!response.ok) {
        throw new Error("Failed to generate caption")
      }

      const data = await response.json()
      const caption = data.choices[0].message.content
      console.log("Generated caption:", caption)
      setCaption(caption)
    } catch (error) {
      console.error("Failed to generate caption:", error)
    }
  }
  const handleSourceImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewSource(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const saveCharacter = async () => {
    console.log("saveCharacter")
  }
  const handleGenFilm = async () => {
    // { generateScript, generateImagePrompts }
    const script = await generateScript(filmPlot)
    const imagePrompts = await generateScript(script)
    setGenScript(script)
    // setGenImagePrompts(imagePrompts)
    const imageDesc = await genImageStory(script)
    console.log("imageDesc - ", imageDesc)
    console.log("handleGenFilm")

    const image1 = await genImagePrompt(imageDesc, "1")
    const image2 = await genImagePrompt(imageDesc, "2")
    const image3 = await genImagePrompt(imageDesc, "3")
    const image4 = await genImagePrompt(imageDesc, "4")
    const image5 = await genImagePrompt(imageDesc, "5")
    setGenImagePrompts([image1, image2, image3, image4, image5])
    console.log("images: ", image1, image2, image3, image4, image5)

    // await generateImagesForPrompts([image1, image2, image3, image4, image5])

    const image1Res = await generateImage(image1, 4)
    console.log("image1Res", image1Res)
    saveImagesToS3(image1Res, "generated", imageDesc, 1)
  }

  // Save images to local storage
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="text-xl">1. Describe your character</h1>
      <Textarea
        value={characterDesc}
        onChange={(e) => setCharacterDesc(e.target.value)}
        className="my-4 h-[200px] w-full max-w-[700px]"
        placeholder="Describe your character"
      />
      <Button onClick={saveCharacter} className="my-2">
        save character
      </Button>
      <h2 className="my-2 text-xl">2. Take a selfie</h2>
      <UserImage setPreviewSource={setPreviewSource} />
      <h2 className="my-2 text-xl">3. Describe the plot of the film</h2>
      <Textarea
        value={filmPlot}
        onChange={(e) => setFilmPlot(e.target.value)}
        className="my-4 h-[300px] w-full max-w-[700px]"
        placeholder="Describe the film plot"
      />
      <Button onClick={handleGenFilm} className="my-2">
        generate film
      </Button>
      <IntermediateSteps />
      <GeneratedImages userImagesGen={userImagesGen} />
    </div>
  )
}

export default ImageGen
