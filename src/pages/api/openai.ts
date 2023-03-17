
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

type Data = {
  content?: string
  code?: string
  hasError?: boolean
  errorMessage?: string
}

const systemPrompt = `
# 命令書:
あなたは世界最高のフロントエンドエンジニアです。
以下の制約条件を満たした上で、最高のコードを書いてください。

# 制約条件:
1. bodyタグの直下に挿入される想定で書いてください。
2. プロジェクト内では、TailwindCSSが使えます。要素をスタイリングする際は、TailwindCSSのクラスを使ってください。
3. 出力するオブジェクトは必ずマークダウンのhtmlコードブロックで囲んでください。例: \`\`\`html\nコード\n\`\`\`
4. JavaScriptが必要になった場合でも、必ずマークアップと同じhtmlコードブロックの内部にインライン要素として記述してください囲んでください。
5. どんなに長いコードでも必ず一つのhtmlコードブロックに収めてください。
`

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
        { role: "system", content: systemPrompt },
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
