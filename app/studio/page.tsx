import {
  getAllGeneratedByUserId,
  getAllGeneratedByUserIdType,
} from "@/lib/database/generated"
import { StudioContainer } from "@/components/StudioContainer"

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
    <StudioContainer
      userImagesGen={userImagesGen}
      userGenVideos={userGenVideos}
    />
  )
}
