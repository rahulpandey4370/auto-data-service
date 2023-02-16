import { Test, TestingModule } from '@nestjs/testing';
import { AutoDataServiceLib } from './auto-data.service';

describe('AutoDataServiceLib', () => {
  let service: AutoDataServiceLib;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoDataServiceLib],
    }).compile();

    service = module.get<AutoDataServiceLib>(AutoDataServiceLib);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
