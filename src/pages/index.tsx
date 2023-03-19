import Head from "next/head";
import { useEffect, useState, KeyboardEvent } from "react";
import {
  DATE_FORMAT,
  EMBED_TARGET_ID,
  MESSAGE_ROLE,
} from "@/utils/constants";
import { MessageLog, MessageRole } from "@/utils/types";
import { MessageList } from "@/conmponents/MessageLog";
import dayjs from "dayjs";
import Header from "@/conmponents/Header";
import Information from "@/conmponents/Information";
import { updateProject, embedProject } from "@/utils/stackBlitzClient";

export default function Home() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({
    apiKey: "",
  });
  const [messageLog, setMessageLog] = useState<MessageLog[]>([]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const isCmdEnter =
      (event.metaKey || event.ctrlKey) && event.key === "Enter";

    if (isCmdEnter && message && !loading) {
      submit();
    }
  };

  const updateMessageLog = (role: MessageRole, content: string) => {
      setMessageLog((prevMessageLog) => [
        ...prevMessageLog,
        {
          role,
          content,
          createdAt: dayjs().format(DATE_FORMAT),
        },
      ]);
    }

  const submit = async () => {
    setLoading(true);
    try {
      updateMessageLog(MESSAGE_ROLE.USER, message)
      setMessage("");

      const res = await fetch("/api/generate_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: setting.apiKey,
          prompt: message,
          chatHistory: chatHistory.length
            ? [chatHistory[0], ...chatHistory.slice(-1)]
            : [],
        }),
      });
      const resJson = await res.json();

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: "user", content: message },
        { role: "assistant", content: resJson.content },
      ]);

      if (!resJson.code) {
        updateMessageLog(MESSAGE_ROLE.GPT, resJson.content)
        return;
      }

      await updateProject(resJson.code);

      updateMessageLog(MESSAGE_ROLE.GPT, "完了しました")
    } catch (error) {
      console.error(error);
      updateMessageLog(MESSAGE_ROLE.GPT, "すいません。Errorが発生しました。devtoolsでerrorを確認してください。")
    } finally {
      setLoading(false);
    }
  };

  const initialize = () => {
    setChatHistory([])
    setMessageLog([
      {
        role: MESSAGE_ROLE.GPT,
        content: "何を作りますか？",
        createdAt: dayjs().format(DATE_FORMAT),
      },
    ])
    embedProject(EMBED_TARGET_ID);
  }

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>ChatGPT x StackBlitz</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto px-5" style={{ height: "100svh" }}>
          <Header />
          <Information
            apiKey={setting.apiKey}
            setApiKey={(v) => setSetting({ ...setting, apiKey: v })}
          />
          <div className="grid sm:grid-cols-2 gap-5 py-10">
            <div className="flex flex-col justify-end h-full w-full">
              <div className="bg-gray-700 p-3 h-full flex flex-col justify-end mb-2 rounded-lg">
                <MessageList messages={messageLog} />
              </div>
              <div className="">
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={message}
                  className="textarea w-full !bg-gray-100 !text-gray-900"
                  placeholder="（例) SNSの登録フォームを作って"
                ></textarea>
                <button
                  className="btn btn-active bg-gradient-to-r disabled:from-cyan-700 disabled:to-blue-800 from-cyan-500 to-blue-500 text-white disabled:text-gray-400 w-full"
                  onClick={submit}
                  disabled={!message || loading}
                >
                  Submit
                </button>
                <button onClick={initialize}>Reset Chat</button>
              </div>
            </div>
            <div className="relative">
              <div className="" id={EMBED_TARGET_ID}>
                <p className="p-4 bg-gray-100 rounded-lg">Embed will go here</p>
              </div>
              {loading && (
                <div className="absolute bg-[rgba(0,0,0,0.6)] inset-0 h-full w-full grid content-center justify-center">
                  <img src="spin.svg" width="100"></img>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
