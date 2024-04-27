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

const userId = "123"

const IntermediateSteps = () => {
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
  // Save images to local storage
  return (
    <div className="flex w-full flex-col items-center">
      <Accordion type="multiple" collapsible className="w-full">
        <h1 className="text-2xl">Intermediate Steps</h1>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            {genScript && <FaCheckCircle className="mr-2 text-green-400" />}
            Generated Script
          </AccordionTrigger>
          <AccordionContent>{genScript}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            {genImagePrompts.length > 0 && (
              <FaCheckCircle className="mr-2 text-green-400" />
            )}
            Generated Image Prompts
          </AccordionTrigger>
          <AccordionContent>
            {(genImagePrompts || []).join("\n\n\n prompt: \n\n")}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            {genImages.length > 0 && (
              <FaCheckCircle className="mr-2 text-green-400" />
            )}
            Generated Images
          </AccordionTrigger>
          <AccordionContent>{renderGenImages(genImages)}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            {genVideos.length > 0 && (
              <FaCheckCircle className="mr-2 text-green-400" />
            )}
            Generated Videos
          </AccordionTrigger>
          <AccordionContent>{renderGenVideos(genVideos)}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default IntermediateSteps
