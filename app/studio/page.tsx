import ContactForm from "@/components/pages/contact-form"
import HeadingText from "@/components/heading-text"
import ImageGen from "@/components/ImageGen"
import Gallery from "@/components/Gallery"

export const metadata = {
  title: "Studio",
}

export default function Studio() {
  return (
    <main className="container flex flex-col items-center py-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        <HeadingText subtext="Let your imagination run wild">
          Studio
        </HeadingText>
        <ImageGen />
        <Gallery />
      </div>
    </main>
  )
}
