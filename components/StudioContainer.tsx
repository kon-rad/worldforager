"use client"

import HeadingText from "@/components/heading-text"
import ImageGen from "@/components/ImageGen"
import Gallery from "@/components/Gallery"
import GalleryVideo from "@/components/GalleryVideo"

export const StudioContainer = ({ userImagesGen, userGenVideos }: any) => {
  return (
    <main className="container flex flex-col items-center py-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        <HeadingText subtext="Let your imagination run wild" className="my-4">
          Short Film Studio
        </HeadingText>
        <ImageGen userImagesGen={userImagesGen} />
        <Gallery userImagesGen={userImagesGen} />
        <GalleryVideo userGenVideos={userGenVideos} />
      </div>
    </main>
  )
}
