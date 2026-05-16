import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  create(items: object[], total: number) {
    return this.prisma.order.create({
      data: { items: JSON.stringify(items), total },
    });
  }
}
