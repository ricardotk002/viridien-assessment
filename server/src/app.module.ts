import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { MenuModule } from './menu/menu.module';
import { ChatModule } from './chat/chat.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, MenuModule, ChatModule, OrdersModule, AdminModule],
})
export class AppModule {}
