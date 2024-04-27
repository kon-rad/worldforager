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

  // Save images to local storage
  return (
    <div className="flex w-full flex-col items-center">
      <Accordion type="single" collapsible className="w-full">
        <h1 className="text-2xl">Intermediate Steps</h1>
        <AccordionItem value="item-2">
          <AccordionTrigger>Generated Script</AccordionTrigger>
          <AccordionContent>{genScript}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Generated Image Prompts</AccordionTrigger>
          <AccordionContent>{genImagePrompts}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Generated Images</AccordionTrigger>
          <AccordionContent>{genImages}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Generated Videos</AccordionTrigger>
          <AccordionContent>{genVideos}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default IntermediateSteps
