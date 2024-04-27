import React, { createContext, useContext, useState } from "react"

// Create context with a default empty state
const GlobalStateContext = createContext<any | undefined>(undefined)

// Provider component
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [characterDesc, setCharacterDesc] = useState("")
  const [filmPlot, setFilmPlot] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  // Value to be passed to provider
  const value = {
    characterDesc,
    previewUrl,
    setCharacterDesc,
    setPreviewUrl,
    filmPlot,
    setFilmPlot,
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
