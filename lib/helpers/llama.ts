const gemma = "google/gemma-2b-it"
const llama38b = "meta-llama/Llama-3-8b-chat-hf"
const llama2 = "meta-llama/Llama-2-13b-chat-hf"
export const askLlamma3 = async (messages: any, stream: boolean = false) => {
  const togetherAPIKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY // Ensure you have this environment variable set
  const togetherAPIURL = "https://api.together.xyz/v1/chat/completions"

  try {
    console.log("togetherAPIKey NEXT_PUBLIC_TOGETHER_API_KEY", togetherAPIKey)

    const response = await fetch(togetherAPIURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${togetherAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: llama38b,
        messages,
        temperature: 0.8,
        stream_tokens: stream,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("togethe rresponse :", data.choices[0].message)
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error fetching question from Together API:", error)
    throw error
  }
}

export const genImagePromptWLlama = async (
  imagesDesc: string,
  imageNumber: string,
  characterDesc: string
) => {
  const ImageGenSysPrompt = `You are an AI that writes excellent image prompts for an AI image generator`
  const prompt = `Write a prompt for an image generating AI model.
    Take the description number ${imageNumber} from this story. 
    Then generate a prompt for an AI image generator.
    Make sure the main character is the feature of the story, and that they are clearly visible.


    The images:
    ${imagesDesc}

    The character description:
    ${characterDesc} 

    Remember only return the prompt for the image number: ${imageNumber}
    `

  const messages = [
    {
      role: "system",
      content: ImageGenSysPrompt,
    },
    {
      role: "user",
      content: prompt,
    },
  ]
  const result = await askLlamma3(messages, false)
  console.log("askLlamma3 result: ", result)

  return result
}
export const generateScriptForAudioLlama = async (scriptText: string) => {
  const scriptSysPrompt = `You are an AI that assists with creating a script for the voice actor in a film.`

  const prompt = `Take this script and extract only the text for the voice actor narrator to read. DO NOT include any text 
  other the lines being spoken. The voice actor narrator will read all the text returned.
  ${scriptText}
  `

  const messages = [
    {
      role: "system",
      content: scriptSysPrompt,
    },
    {
      role: "user",
      content: prompt,
    },
  ]

  const result = await askLlamma3(messages, false)
  console.log("askLlamma3 result: ", result)
  return result
}
