import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RECREATIONAL_SERVICE_CLIENT } from '../constants';
import {
  CreateRecreationalFacilityDto,
  FacilityAvailabilityDto,
  FindFacilitiesFilterDto,
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

  findAll(
    filters: FindFacilitiesFilterDto,
  ): Observable<RecreationalFacilityDto[]> {
    return this.recreationalClient.send<
      RecreationalFacilityDto[],
      FindFacilitiesFilterDto
    >(RECREATIONAL_FACILITIES_PATTERNS.FIND_ALL, filters);
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

  remove(id: number): Observable<RecreationalFacilityDto> {
    return this.recreationalClient.send<RecreationalFacilityDto, number>(
      RECREATIONAL_FACILITIES_PATTERNS.DELETE,
      id,
    );
  }

  getAvailability(
    facilityId: number,
    date: Date,
  ): Observable<FacilityAvailabilityDto> {
    return this.recreationalClient.send<
      FacilityAvailabilityDto,
      { facilityId: number; date: Date }
    >(RECREATIONAL_FACILITIES_PATTERNS.GET_AVAILABILITY, { facilityId, date });
  }

  getMultipleAvailability(
    facilityIds: number[],
    date: Date,
  ): Observable<FacilityAvailabilityDto[]> {
    return this.recreationalClient.send<
      FacilityAvailabilityDto[],
      { facilityIds: number[]; date: Date }
    >(RECREATIONAL_FACILITIES_PATTERNS.GET_MULTIPLE_AVAILABILITY, {
      facilityIds,
      date,
    });
  }
}
