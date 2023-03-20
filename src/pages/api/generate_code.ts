import { SYSTEM_PROMPT } from '../../utils/constants';
import EnLocale from '../../../public/locales/en/common.json';
import JaLocale from '../../../public/locales/ja/common.json';

import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

type Data = {
  content?: string
  code?: string
  hasError?: boolean
  errorMessage?: string
}

type RequestBody = {
  locale: string
  prompt: string
  chatHistory: { role: ChatCompletionRequestMessageRoleEnum; content: string }[]
  apiKey?: string
}

interface CustomNextApiRequest extends NextApiRequest {
  body: RequestBody;
}

// MEMO: いろいろ適当なので後で直す。特にエラーハンドリングが雑すぎる..
export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const { prompt, chatHistory, apiKey, locale } = req.body;
      const safeApiKey = apiKey || process.env.OPEN_AI_API_KEY;
      const isJa = locale === 'ja';
      const localeTexts = isJa ? JaLocale : EnLocale;
      const systemPrompt = isJa ? SYSTEM_PROMPT.JA : SYSTEM_PROMPT.EN;

      if(!safeApiKey) {
        res.status(200).json({ content: localeTexts.api.apiKeyNotSet })
      }

      const configuration = new Configuration({
        apiKey: safeApiKey
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: prompt }
        ]
      });
      const assistantResponse = completion.data.choices[0].message?.content;

      const codeBlockPattern = /```html\n([\s\S]+?)\r?\n```/
      const matchResult = assistantResponse?.match(codeBlockPattern)

      if (matchResult && matchResult.length > 1) {
        res.status(200).json({ content: assistantResponse, code: matchResult[1] })
      } else {
        res.status(200).json({ content: assistantResponse})
      }
    } catch (error) {
      res.status(500).json({ content: "", hasError: true, errorMessage: (error as Error).message });
    }
  } else {
    res.status(405).json({ content: "", hasError: true, errorMessage: "Error: Bad request" });
  }
}
