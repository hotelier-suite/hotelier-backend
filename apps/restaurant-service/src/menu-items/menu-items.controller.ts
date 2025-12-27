import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuItemsService } from './menu-items.service';
import {
  MENU_ITEMS_PATTERNS,
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@app/contracts/restaurant-service';

@Controller()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @MessagePattern(MENU_ITEMS_PATTERNS.FIND_ALL)
  findAll(): Promise<MenuItemDto[]> {
    return this.menuItemsService.findAll();
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<MenuItemDto> {
    return this.menuItemsService.findOne(id);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.CREATE)
  create(@Payload() data: CreateMenuItemDto): Promise<MenuItemDto> {
    return this.menuItemsService.create(data);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateMenuItemDto },
  ): Promise<MenuItemDto> {
    return this.menuItemsService.update(payload.id, payload.data);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<MenuItemDto> {
    return this.menuItemsService.remove(id);
  }
}
