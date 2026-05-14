import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [MenuModule, ChatModule],
})
export class AppModule {}
