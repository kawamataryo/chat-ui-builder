export const MESSAGE_ROLE = {
  GPT: 'gpt',
  USER: 'user',
} as const

export const STACK_BLITZ_PROJECT_ID = 'chat-builder-playground'

export const EMBED_TARGET_ID = "embed"

export const DATE_FORMAT = "YYYY-MM-DD HH:mm";

export const SYSTEM_PROMPT = `
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
