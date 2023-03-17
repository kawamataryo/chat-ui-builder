import NextHead from "next/head";

const Head = () => {
  return (
    <NextHead>
      <title>Chat UI Builder</title>
      <meta name="description" content="Create interactive UI with chat gpt" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Chat UI Builder"></meta>
      <meta
        property="og:description"
        content="Chat UI Builder is an intuitive, chat-based web UI creation tool that leverages the power of ChatGPT and StackBlitz"
      >
      </meta>
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta property="twitter:domain" content="https://chat-ui-builder.vercel.app"></meta>
      <meta property="twitter:url" content=""></meta>
      <meta name="twitter:title" content="Chat UI Builder"></meta>
      <meta name="twitter:description" content="Chat UI Builder is an intuitive, chat-based web UI creation tool that leverages the power of ChatGPT and StackBlitz"></meta>
      <meta name="twitter:image" content="https://chat-ui-builder.vercel.app/og.png"></meta>
      <meta
        property="og:image"
        content="https://chat-ui-builder.vercel.app/og.png"
      />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}

export default Head
