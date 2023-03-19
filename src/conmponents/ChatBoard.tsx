import { MessageLog } from "@/utils/types";
import { MessageList } from "./MessageLog";
import { KeyboardEvent } from "react";

type Props = {
  message: string;
  loading: boolean;
  messageLog: MessageLog[];
  setMessage: (message: string) => void;
  submit: () => void;
  initialize: () => void;
}

const ChatBoard = ({ message, loading, messageLog, setMessage, submit, initialize}: Props) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const isCmdEnter =
      (event.metaKey || event.ctrlKey) && event.key === "Enter";

    if (isCmdEnter && message && !loading) {
      submit();
    }
  };

  return (
    <>
      <div className="bg-gray-800 p-3 h-full flex flex-col justify-end mb-2 rounded-lg min-h-[350px]">
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
          className="btn btn-active bg-gradient-to-r disabled:from-cyan-800 disabled:to-blue-900 from-cyan-500 to-blue-500 text-white disabled:text-gray-400 w-full"
          onClick={submit}
          disabled={!message || loading}
        >
          Submit
        </button>
        <button onClick={initialize}>Reset Chat</button>
      </div>
    </>
  );
};
export default ChatBoard;
