import ContactForm from "@/components/pages/contact-form"
import HeadingText from "@/components/heading-text"
import ImageGen from "@/components/ImageGen"
import Gallery from "@/components/Gallery"
import GalleryVideo from "@/components/GalleryVideo"
import {
  getAllGeneratedByUserId,
  getAllGeneratedByUserIdType,
} from "@/lib/database/generated"

export const metadata = {
  title: "Studio",
}

export default async function Studio() {
  const userImagesGen = await getAllGeneratedByUserIdType("123", "generated")
  const userGenVideos = await getAllGeneratedByUserIdType(
    "123",
    "generatedVideo"
  )
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
