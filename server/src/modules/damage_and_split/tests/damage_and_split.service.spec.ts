import { Test, TestingModule } from '@nestjs/testing';
import { DamageAndSplitService } from '../damage_and_split.service';

describe('DamageAndSplitService', () => {
  let service: DamageAndSplitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DamageAndSplitService],
    }).compile();

    service = module.get<DamageAndSplitService>(DamageAndSplitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
