import { Test } from '@nestjs/testing';
import { EmployeeRequestsModule } from './employee-requests.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeRequest } from './entities';
import { Employee } from '../employees/entities';

describe('EmployeeRequestsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [EmployeeRequestsModule],
    })
      .overrideProvider(getRepositoryToken(EmployeeRequest))
      .useValue({})
      .overrideProvider(getRepositoryToken(Employee))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
