import Head from "next/head";
import { useEffect, useState, KeyboardEvent } from "react";
import { DATE_FORMAT, EMBED_TARGET_ID, MESSAGE_ROLE } from "@/utils/constants";
import { MessageLog, MessageRole } from "@/utils/types";
import dayjs from "dayjs";
import Header from "@/conmponents/Header";
import Information from "@/conmponents/Information";
import { updateProject, embedProject } from "@/utils/stackBlitzClient";
import ChatBoard from "@/conmponents/ChatBoard";
//import EmbedBoard from "@/conmponents/EmbedBoard";
import CoverImage from "@/conmponents/CoverImage";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";

export default function Home() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({
    apiKey: "",
  });
  const [messageLog, setMessageLog] = useState<MessageLog[]>([]);

  const { t, i18n } = useTranslation('common')

  const updateMessageLog = (role: MessageRole, content: string) => {
    setMessageLog((prevMessageLog) => [
      ...prevMessageLog,
      {
        role,
        content,
        createdAt: dayjs().format(DATE_FORMAT),
      },
    ]);
  };

  const submit = async () => {
    setLoading(true);
    try {
      updateMessageLog(MESSAGE_ROLE.USER, message);
      setMessage("");

      const res = await fetch("/api/generate_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: i18n.language,
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
        updateMessageLog(MESSAGE_ROLE.GPT, resJson.content);
        return;
      }

      await updateProject(resJson.code);

      updateMessageLog(MESSAGE_ROLE.GPT, t('chatBoard.completeMessage'));
    } catch (error) {
      console.error(error);
      updateMessageLog(
        MESSAGE_ROLE.GPT,
        t('chatBoard.errorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  const initialize = () => {
    setChatHistory([]);
    setMessageLog([
      {
        role: MESSAGE_ROLE.GPT,
        content: t('chatBoard.initialMessage'),
        createdAt: dayjs().format(DATE_FORMAT),
      },
    ]);
    embedProject(EMBED_TARGET_ID);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>Speak With God Now</title>
        <meta name="description" content="Our application allows users to connect with God through meaningful conversations and personalized messages. Using advanced technology, our app simulates communication with the divine, providing a unique spiritual experience for users. Whether you're seeking guidance, inspiration, or simply a deeper connection with the divine, our app makes it easy to connect with God anytime, anywhere. Join the millions of people who have already discovered the power of our app and start your own conversation with the Almighty today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto px-5" style={{ height: "100svh" }}>
          <Header />
          <CoverImage />
          <Information
            apiKey={setting.apiKey}
            setApiKey={(v) => setSetting({ ...setting, apiKey: v })}
            t={t}
          />
          <div className="grid sm:grid-cols-2 gap-5 py-10">
            <div className="flex flex-col justify-end h-full w-full">
              <ChatBoard
                messageLog={messageLog}
                message={message}
                setMessage={setMessage}
                submit={submit}
                initialize={initialize}
                loading={loading}
                t={t}
              ></ChatBoard>
            </div>
            <div className="relative">
              <EmbedBoard loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}


export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}
