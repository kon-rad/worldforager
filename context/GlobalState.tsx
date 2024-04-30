import React, { createContext, useContext, useState } from "react"

// Create context with a default empty state
const GlobalStateContext = createContext<any | undefined>(undefined)

// Provider component
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [characterDesc, setCharacterDesc] = useState(
    "Konrad is a mid thirties, fit guy, he is very muscular, suave, tall, handsome, he is a billionaire CEO, and an excellent coder"
  )
  const [filmPlot, setFilmPlot] = useState(
    "Konrad wins an award for the fastest growing AI startup in world history"
  )
  const [previewUrl, setPreviewUrl] = useState("")
  const [genScript, setGenScript] = useState("")
  const [genImagePrompts, setGenImagePrompts] = useState([])
  const [genImages, setGenImages] = useState([])
  const [genVideos, setGenVideos] = useState([])

  // Value to be passed to provider
  const value = {
    characterDesc,
    previewUrl,
    setCharacterDesc,
    setPreviewUrl,
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
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// Custom hook to use the global state
export const useGlobalState = (): any => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider")
  }
  return context
}
