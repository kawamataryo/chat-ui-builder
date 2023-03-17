import { MESSAGE_ROLE } from "./constants";
import dayjs from 'dayjs'

export type MessageRole = typeof MESSAGE_ROLE[keyof typeof MESSAGE_ROLE]
export type MessageLog = { role: MessageRole; content: string, createdAt: string }
