import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { z } from "zod";

export const requestBodySchema = z.object({
  locale: z.string().nonempty(),
  prompt: z.string().nonempty(),
  chatHistory: z.array(
    z.object({
      role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
      content: z.string().nonempty(),
    })
  ),
  apiKey: z.string().optional(),
});
