import { SYSTEM_PROMPT } from './../../utils/constants';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

type Data = {
  content?: string
  code?: string
  hasError?: boolean
  errorMessage?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
    const { prompt, chatHistory, apiKey } = req.body;

    if(!apiKey) {
      res.status(200).json({ content: "API Keyが設定されていません" })
    }

    const configuration = new Configuration({
      apiKey
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: `指示: ${prompt}` }
      ]
    });
    const assistantResponse = completion.data.choices[0].message?.content;

    // コードブロックを抽出
    const codeBlockPattern = /```html\n([\s\S]+?)\r?\n```/
    const matchResult = assistantResponse?.match(codeBlockPattern)

    if (matchResult && matchResult.length > 1) {
      res.status(200).json({ content: assistantResponse, code: matchResult[1] })
    } else {
      res.status(200).json({ content: assistantResponse})
    }
  } catch (error) {
    console.error(error);
  }
  } else {
    res.status(405).json({ content: "", hasError: true, errorMessage: "Error: Bad request" });
  }
}
