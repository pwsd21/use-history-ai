declare module "@google/genai" {
  export interface GenAIConfig {
    apiKey: string;
  }

  export interface ChatMessage {
    text: string;
  }

  export interface SendMessageOptions {
    message: ChatMessage[];
  }

  export interface ChatResponse {
    text?: string;
  }

  export interface Chat {
    sendMessage(options: SendMessageOptions): Promise<ChatResponse>;
  }

  export interface ChatsCreateOptions {
    model: string;
  }

  export interface Chats {
    create(options: ChatsCreateOptions): Chat;
  }

  export class GoogleGenAI {
    constructor(config: GenAIConfig);
    chats: Chats;
  }
}
