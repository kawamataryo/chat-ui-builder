import { SYSTEM_PROMPT } from '../../utils/constants';
import EnLocale from '../../../public/locales/en/common.json';
import JaLocale from '../../../public/locales/ja/common.json';

import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import { requestBodySchema } from '@/utils/zodSchema';

type Data = {
  content?: string;
  code?: string;
  hasError?: boolean;
  errorMessage?: string;
};

type RequestBody = {
  locale: string;
  prompt: string;
  chatHistory: { role: ChatCompletionRequestMessageRoleEnum; content: string }[];
  apiKey?: string;
};

interface CustomNextApiRequest extends NextApiRequest {
  body: RequestBody;
}

async function fetchCompletion({
  openai,
  systemPrompt,
  chatHistory,
  prompt,
}: {
  openai: OpenAIApi;
  systemPrompt: string;
  chatHistory: RequestBody['chatHistory'];
  prompt: string;
}) {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: prompt },
    ],
  });
  return completion.data.choices[0].message?.content;
}

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ errorMessage: 'Error: Bad request' });
    return;
  }

  const validationResult = requestBodySchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({ errorMessage: 'Error: Invalid request body' });
    return;
  }

  const { prompt, chatHistory, apiKey, locale } = validationResult.data;
  const safeApiKey = apiKey || process.env.OPEN_AI_API_KEY;
  const isJa = locale === 'ja';
  const localeTexts = isJa ? JaLocale : EnLocale;
  const systemPrompt = isJa ? SYSTEM_PROMPT.JA : SYSTEM_PROMPT.EN;

  if (!safeApiKey) {
    res.status(200).json({ content: localeTexts.api.apiKeyNotSet });
    return;
  }

  const openai = new OpenAIApi(new Configuration({ apiKey: safeApiKey }));

  try {
    const assistantResponse = await fetchCompletion({
      openai,
      systemPrompt,
      chatHistory,
      prompt,
    });

    const codeBlockPattern = /```html\n([\s\S]+?)\r?\n```/;
    const matchResult = assistantResponse?.match(codeBlockPattern);

    if (matchResult && matchResult.length > 1) {
      res.status(200).json({ content: assistantResponse, code: matchResult[1] });
    } else {
      res.status(200).json({ content: assistantResponse });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: (error as Error).message });
  }
}
