import { Test } from '@nestjs/testing';
import { EmployeesModule } from './employees.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities';

describe('EmployeesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [EmployeesModule],
    })
      .overrideProvider(getRepositoryToken(Employee))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
