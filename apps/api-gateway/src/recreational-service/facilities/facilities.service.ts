import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RECREATIONAL_SERVICE_CLIENT } from '../constants';
import {
  CreateRecreationalFacilityDto,
  FacilityAvailabilityDto,
  FacilityType,
  RecreationalFacilityDto,
  RECREATIONAL_FACILITIES_PATTERNS,
  UpdateRecreationalFacilityDto,
} from '@app/contracts/recreational-service';

@Injectable()
export class FacilitiesService {
  constructor(
    @Inject(RECREATIONAL_SERVICE_CLIENT)
    private readonly recreationalClient: ClientProxy,
  ) {}

  findAll(): Observable<RecreationalFacilityDto[]> {
    return this.recreationalClient.send<
      RecreationalFacilityDto[],
      Record<string, never>
    >(RECREATIONAL_FACILITIES_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<RecreationalFacilityDto> {
    return this.recreationalClient.send<RecreationalFacilityDto, number>(
      RECREATIONAL_FACILITIES_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(
    data: CreateRecreationalFacilityDto,
  ): Observable<RecreationalFacilityDto> {
    return this.recreationalClient.send<
      RecreationalFacilityDto,
      CreateRecreationalFacilityDto
    >(RECREATIONAL_FACILITIES_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateRecreationalFacilityDto,
  ): Observable<RecreationalFacilityDto> {
    return this.recreationalClient.send<
      RecreationalFacilityDto,
      { id: number; data: UpdateRecreationalFacilityDto }
    >(RECREATIONAL_FACILITIES_PATTERNS.UPDATE, { id, data });
  }

  delete(id: number): Observable<RecreationalFacilityDto> {
    return this.recreationalClient.send<RecreationalFacilityDto, number>(
      RECREATIONAL_FACILITIES_PATTERNS.DELETE,
      id,
    );
  }

  findAvailable(): Observable<RecreationalFacilityDto[]> {
    return this.recreationalClient.send<
      RecreationalFacilityDto[],
      Record<string, never>
    >(RECREATIONAL_FACILITIES_PATTERNS.FIND_AVAILABLE, {});
  }

  findByType(type: FacilityType): Observable<RecreationalFacilityDto[]> {
    return this.recreationalClient.send<
      RecreationalFacilityDto[],
      FacilityType
    >(RECREATIONAL_FACILITIES_PATTERNS.FIND_BY_TYPE, type);
  }

  getAvailability(
    facilityId: number,
    date: string,
  ): Observable<FacilityAvailabilityDto> {
    return this.recreationalClient.send<
      FacilityAvailabilityDto,
      { facilityId: number; date: string }
    >(RECREATIONAL_FACILITIES_PATTERNS.GET_AVAILABILITY, { facilityId, date });
  }

  getMultipleAvailability(
    facilityIds: number[],
    date: string,
  ): Observable<FacilityAvailabilityDto[]> {
    return this.recreationalClient.send<
      FacilityAvailabilityDto[],
      { facilityIds: number[]; date: string }
    >(RECREATIONAL_FACILITIES_PATTERNS.GET_MULTIPLE_AVAILABILITY, {
      facilityIds,
      date,
    });
  }
}
