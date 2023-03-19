import { MESSAGE_ROLE } from '@/utils/constants';
import { MessageLog } from '@/utils/types';
import { useEffect, useRef } from 'react';

const Message = ({ role, content, createdAt }: MessageLog)  => {
  const isUser = role === MESSAGE_ROLE.USER
  const positionClass = isUser ? 'chat-end' : 'chat-start'
  const iconClass = isUser ? 'bg-gradient-to-r from-[#ada996] to-[#eaeaea]' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
  const roleIcon = isUser ? '🙏 ' : '👤'

  return (
    <>
    <div className={`${positionClass} chat`}>
      <div className="chat-image avatar">
        <div className={`${iconClass} w-8 h-8 rounded-full !grid place-items-center`}>
          {roleIcon}
        </div>
      </div>
      <div className="chat-header text-gray-100">
        <time className="text-[10px]">{ createdAt }</time>
      </div>
      <div className="chat-bubble bg-gray-100 text-black text-sm min-h-0">{ content }</div>
    </div>
    </>
  )
}

export const MessageList = ({ messages }: { messages: MessageLog[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="max-h-[370px] overflow-y-scroll scrollbar-hide" ref={scrollRef}>
      {messages.map((message, index) => <div key={index}>{Message(message)}</div>)}
    </div>
  )
}
