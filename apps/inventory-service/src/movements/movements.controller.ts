import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INVENTORY_MOVEMENTS_PATTERNS } from '@app/contracts/inventory-service/movements/movements.patterns';
import { InventoryMovementDto } from '@app/contracts/inventory-service/movements/dto/inventory-movement.dto';
import { CreateInventoryMovementDto } from '@app/contracts/inventory-service/movements/dto/create-inventory-movement.dto';
import { MovementsService } from './movements.service';

@Controller()
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @MessagePattern(INVENTORY_MOVEMENTS_PATTERNS.GET_ALL)
  findAll(): Promise<InventoryMovementDto[]> {
    return this.movementsService.findAll();
  }

  @MessagePattern(INVENTORY_MOVEMENTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateInventoryMovementDto,
  ): Promise<InventoryMovementDto> {
    return this.movementsService.create(data);
  }
}
