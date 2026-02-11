import { Test } from '@nestjs/testing';
import { AttendanceModule } from './attendance.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attendance } from './entities';
import { Employee } from '../employees/entities';

describe('AttendanceModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AttendanceModule],
    })
      .overrideProvider(getRepositoryToken(Attendance))
      .useValue({})
      .overrideProvider(getRepositoryToken(Employee))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});
