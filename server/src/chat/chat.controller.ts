import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Post()
  send(@Body() body: { messages: { role: 'user' | 'assistant'; content: string }[]; cart: any[] }) {
    return this.chat.chat(body.messages, body.cart);
  }
}
