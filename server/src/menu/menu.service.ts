import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const items = await this.prisma.menuItem.findMany();
    return items.map((item) => ({
      ...item,
      price: Number(item.price),
      tags: JSON.parse(item.tags),
      sizes: item.sizes ? JSON.parse(item.sizes) : undefined,
    }));
  }
}
