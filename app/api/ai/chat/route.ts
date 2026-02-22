import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getRecipeChatbotSystemPrompt } from '@/lib/recipe-knowledge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    system: getRecipeChatbotSystemPrompt(),
    temperature: 0.7,
  })
  
  return result.toTextStreamResponse()
}


