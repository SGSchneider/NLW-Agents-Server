import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GOOGLE_GENAI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(
  audioAsBase64: string,
  mimeType: string
): Promise<string> {
  try {
    const response = await gemini.models.generateContent({
      model,
      contents: [
        {
          text: 'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriado.',
        },
        {
          inlineData: {
            mimeType,
            data: audioAsBase64,
          },
        },
      ],
    })

    if (response.text) {
      return response.text
    }
    throw new Error('Transcription failed.')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Error during transcription: ${errorMessage}`)
  }
}


export async function generateEmbeddings(text:string){
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{text}],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    }
  })

  if(!response.embeddings?.[0].values){
    throw new Error('Failed to generate embeddings.')
  }

  return response.embeddings[0].values
}


export async function generateAnswer(question: string, transcriptions: string[]) {
  const context = transcriptions.join('\n\n')

  const prompt = `
  Com base no texto fornecido abaixo como contexto, responda à pergunta de forma clara e objetiva em português do Brasil.
  
  Contexto:
  ${context}

  Pergunta:
  ${question}

  Instruções:
  - Utilize apenas informações contidas no contexto fornecido.
  - Responda de forma objetiva.
  - Se a resposta não estiver no contexto, apenas responda que não possui informações o suficiente para responder a pergunta.
  - Mantenha um tom profissional e educado.
  - Cite trechos do contexto quando necessário para embasar sua resposta.
  - Evite repetir frases inteiras.
  - Quando citar trechos do contexto, refira-se a ele como conteúdo da aula.
  
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: `${prompt}`,
      },
    ],
  })

  if(!response.text) {
    throw new Error('Failed to generate answer.')
  }

  return response.text
}