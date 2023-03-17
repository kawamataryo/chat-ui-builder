import { useEffect, useState, KeyboardEvent } from "react";
import { DATE_FORMAT, EMBED_TARGET_ID, MESSAGE_ROLE } from "@/utils/constants";
import { MessageLog, MessageRole } from "@/utils/types";
import dayjs from "dayjs";
import Header from "@/conmponents/Header";
import Information from "@/conmponents/Information";
import { updateProject, embedProject } from "@/utils/stackBlitzClient";
import ChatBoard from "@/conmponents/ChatBoard";
import EmbedBoard from "@/conmponents/EmbedBoard";
import CoverImage from "@/conmponents/CoverImage";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import Footer from "@/conmponents/Footer";
import Head from "@/conmponents/Head";


// MEMO: 全体的に雑なのでリファクタリングしたい
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
            ? chatHistory.slice(-2) // 送信量を減らすために最新の2つのみ送信
            : [],
        }),
      });
      const resJson = await res.json();

      if(res.status !== 200) {
        console.error(resJson.errorMessage);
        updateMessageLog(
          MESSAGE_ROLE.GPT,
          t('chatBoard.errorMessage')
        );
        return;
      }

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
      <Head />
      <main>
        <div className="container mx-auto px-5 pb-10">
          <Header />
          <CoverImage />
          <div className="mt-10">
            <Information
              apiKey={setting.apiKey}
              setApiKey={(v) => setSetting({ ...setting, apiKey: v })}
              t={t}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5 my-10">
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
      <Footer />
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
