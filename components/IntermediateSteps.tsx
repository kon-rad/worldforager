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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaCheckCircle } from "react-icons/fa"
import { FaTimesCircle } from "react-icons/fa" // Import the X icon

const userId = "123"

const IntermediateSteps = ({ userGenVideos }: any) => {
  const [imagesResults, setImagesResults] = useState([])
  const [faceSwappedImage, setFaceSwappedImage] = useState()
  const [prompt, setPrompt] = useState("")
  const [characterPrompt, setCharacterPrompt] = useState("")
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null) // New state for storing selected image
  const [previewSource, setPreviewSource] = useState("")
  const { uploadToS3, files } = useS3Upload()
  const [selectedVideos, setSelectedVideos] = useState<any>([])
  const [combinedVideoElem, setCombinedVideoElem] = useState()

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
  const renderGenImages = (genImageUrls: any = []) => {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {(genImageUrls || []).map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Generated Image ${index + 1}`}
            className="m-2 rounded-lg shadow-lg"
            style={{ width: "200px", height: "auto" }}
          />
        ))}
      </div>
    )
  }
  const renderGenVideos = (genVideoUrls: any = []) => {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {genVideoUrls.map((url: string, index: number) => (
          <video
            key={index}
            src={url}
            alt={`Generated Video ${index + 1}`}
            className="m-2 rounded-lg shadow-lg"
            style={{ width: "200px", height: "auto" }}
            autoPlay
            loop
            muted
          />
        ))}
      </div>
    )
  }
  const renderImagePrompts = (imgPrompts: any) => {
    return (imgPrompts || []).map((imgP: any, i: number) => {
      return (
        <div className="my-4 flex flex-col">
          <div className="text-md my-2">prompt: {i + 1}</div>
          <div className="text-sm text-gray-700">{imgP}</div>
        </div>
      )
    })
  }
  // Save images to local storage

  const handleVideoSelect = (video) => {
    setSelectedVideos([...selectedVideos, video])
  }
  const handleCombine = async () => {
    const videoUrls = selectedVideos.map((video) => ({
      url: video.url,
      publicId: video.id,
    }))

    console.log(" { videoUrls: selectedVideos }", { videoUrls: videoUrls })

    try {
      const response = await axios.post("/api/video/combine", {
        videoUrls: videoUrls,
      })
      console.log(response.data)
      const updatedVideoElement = response?.data?.combinedVideo?.replace(
        /<video(.*?)>/,
        "<video$1 autoplay controls>"
      )
      console.log(
        "updatedVideoElement ",
        updatedVideoElement,
        response?.data?.combinedVideo
      )

      setCombinedVideoElem(updatedVideoElement)
    } catch (error) {
      console.error(error)
    }
  }

  const renderSelectedVideos = () => {
    return selectedVideos.map((video, index) => (
      <div key={index} className="video-container">
        <video src={video.url} /* other video attributes */ />
        <FaCheckCircle className="text-red bg-green h-8 w-8 text-green-600" />
      </div>
    ))
  }
  const handleVideoRemove = (videoToRemove) => {
    setSelectedVideos(selectedVideos.filter((video) => video !== videoToRemove))
  }
  return (
    <div className="my-8 flex w-full flex-col items-center">
      <Accordion type="multiple" collapsible className="w-full">
        <h1 className="text-2xl">Intermediate Steps</h1>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            {" "}
            <div className="flex w-full flex-row">
              {genScript && <FaCheckCircle className="mr-2 text-green-400" />}
              Generated Script
            </div>
          </AccordionTrigger>
          <AccordionContent>{genScript}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            {" "}
            <div className="flex w-full flex-row">
              {genImagePrompts.length > 0 && (
                <FaCheckCircle className="mr-2 text-green-400" />
              )}
              Generated Image Prompts
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderImagePrompts(genImagePrompts || [])}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            {" "}
            <div className="flex w-full flex-row">
              {genImages.length > 0 && (
                <FaCheckCircle className="mr-2 text-green-400" />
              )}
              Generated Images
            </div>
          </AccordionTrigger>
          <AccordionContent>{renderGenImages(genImages)}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            {" "}
            <div className="flex w-full flex-row">
              {genVideos.length > 0 && (
                <FaCheckCircle className="mr-2 text-green-400" />
              )}
              Generated Videos
            </div>
          </AccordionTrigger>
          <AccordionContent>{renderGenVideos(genVideos)}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            {" "}
            <div className="flex w-full flex-row">Combine Videos</div>
          </AccordionTrigger>
          <AccordionContent>
            <h3>select videos to combine:</h3>
            <h3 className="my-2 text-xl">Selected Videos to Combine:</h3>
            <div className="flex w-full flex-row flex-wrap">
              {genVideos.map((video: any, index) => (
                <div
                  className="relative" // Add relative to position the X icon
                  key={index}
                >
                  <video
                    src={video.url}
                    alt={`Generated Video ${index + 1}`}
                    className="m-2 rounded-lg shadow-lg"
                    style={{ width: "200px", height: "auto" }}
                  />
                  <FaTimesCircle
                    className="absolute right-0 top-0 m-2 h-6 w-6 cursor-pointer text-red-600" // Position the X icon
                    onClick={(e) => {
                      e.stopPropagation() // Prevent triggering the div's onClick
                      handleVideoRemove(video)
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <Button onClick={handleCombine}>Combine</Button>
            </div>
            {combinedVideoElem && (
              <div className="flex rounded-xl border p-4 shadow-xl">
                <div dangerouslySetInnerHTML={{ __html: combinedVideoElem }} />
              </div>
            )}

            <h3 className="my-2 text-xl">Video Gallery:</h3>
            <div className="flex w-full flex-row flex-wrap">
              {userGenVideos.map((video: any, index) => (
                <div
                  className=""
                  key={index}
                  onClick={() => handleVideoSelect(video)}
                >
                  <video
                    src={video.url}
                    alt={`Generated Video ${index + 1}`}
                    className="m-2 rounded-lg shadow-lg"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default IntermediateSteps
