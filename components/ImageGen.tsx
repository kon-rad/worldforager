"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import UserImage from "./UserImage"
import SwappedImagesDisplay from "./SwappedImagesDisplay"

const ImageGen = () => {
  const [imagesResults, setImagesResults] = useState([])
  const [faceSwappedImage, setFaceSwappedImage] = useState()
  const [prompt, setPrompt] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null) // New state for storing selected image
  const [previewSource, setPreviewSource] = useState("")

  const generateImage = async () => {
    console.log(process.env.NEXT_PUBLIC_TOGETHER_API_KEY)

    try {
      const response = await fetch("https://api.together.xyz/inference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          // model: "runwayml/stable-diffusion-v1-5",
          // model: "stabilityai/stable-diffusion-xl-base-1.0",
          model: "SG161222/Realistic_Vision_V3.0_VAE",
          prompt: prompt,
          n: 4,
          steps: 20,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("data", data)

      saveImageToLocalStorage(
        data.output.choices.map((choice) => choice.image_base64)
      )

      // Invoke this function after setting the images results in the generateImage function
      setImagesResults(
        data.output.choices.map((choice) => {
          const imageBase64 = `data:image/jpeg;base64,${choice.image_base64}`
          return {
            ...choice,
            image_base64: imageBase64,
          }
        })
      )
    } catch (error) {
      console.error("Failed to generate image:", error)
    }
  }
  const saveImageToLocalStorage = async (images) => {
    const existingImages = JSON.parse(
      localStorage.getItem("savedImages") || "[]"
    )
    const newImages = [...existingImages, ...images]
    localStorage.setItem("savedImages", JSON.stringify(newImages))

    try {
      console.log("images: ", images)

      const { url } = await uploadToS3(file)
      console.log("s3 url: ", url)
      setUrl(url)
      // const res = await updateSite({ image: url }, siteId)

      console.log("uploading to s3 filename: ", file)
      console.log("update db res: ", res)
      toast.success(`Successfully updated main image!`)
    } catch (error) {
      console.error("Error uploading files:", error)
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
  // New function for face swapping
  const faceSwap = async () => {
    console.log("Face swapping with image:", selectedImage)
    // Implement the face swap logic here...
    if (!selectedImage) {
      alert("oops, you need to select an image first")
    }

    try {
      const base64Source = previewSource.split(",")[1]
      const base64Target = selectedImage.split(",")[1]

      const result = await axios.post("/api/image/generate", {
        source: base64Source,
        target: base64Target,
      })
      console.log("swap result ", result)

      const image = result?.data?.response

      setFaceSwappedImage(image)
      generateCaption()

      // Save the face-swapped image to local storage
      const existingSwappedImages = JSON.parse(
        localStorage.getItem("swappedImages") || "[]"
      )
      const newSwappedImages = [...existingSwappedImages, image]
      localStorage.setItem("swappedImages", JSON.stringify(newSwappedImages))
    } catch (error) {
      console.error("Error sending image to server:", error)
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
  const handleIgPost = async () => {
    console.log("handleIgPost")
  }

  // Save images to local storage
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-screen-xl flex-wrap items-center">
        {imagesResults &&
          imagesResults.map((imgRes: any, index) => (
            <div
              key={index}
              className="relative rounded p-4 shadow-xl"
              onClick={() => selectImage(imgRes.image_base64)}
            >
              {selectedImage === imgRes.image_base64 && (
                <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  ✓ {/* Checkmark icon or image */}
                </div>
              )}
              <img
                src={imgRes.image_base64}
                className="rounded-xl"
                width="200px"
                height="200px"
                alt="ai generated image"
              />
            </div>
          ))}
      </div>
      <div className="my-4 flex flex-col items-center justify-center">
        {faceSwappedImage && (
          <div className="rounded p-4 shadow-xl">
            <img
              src={faceSwappedImage}
              className="rounded-xl"
              width="400px"
              height="400px"
              alt="ai generated image"
            />
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="my-4 h-[300px] w-full max-w-[700px]"
              placeholder="Instagram Caption"
            />
            <Button onClick={handleIgPost} className="my-2">
              Post to Instagram
            </Button>
          </div>
        )}
      </div>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="my-4 w-full max-w-[700px]"
        placeholder="Enter prompt for image generation"
      />
      <Button onClick={generateImage}>Generate</Button>
      {selectedImage && (
        <Button onClick={faceSwap} className="mt-4">
          Face Swap
        </Button> // Show this button only when an image is selected
      )}
      <UserImage setPreviewSource={setPreviewSource} />
      <SwappedImagesDisplay />
    </div>
  )
}

export default ImageGen
