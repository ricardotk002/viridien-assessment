import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private menu: MenuService) {}

  @Get()
  findAll() {
    return this.menu.findAll();
  }
}
