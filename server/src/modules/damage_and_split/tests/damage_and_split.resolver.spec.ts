import { Test, TestingModule } from '@nestjs/testing';
import { DamageAndSplitResolver } from '../damage_and_split.resolver';
import { DamageAndSplitService } from '../damage_and_split.service';

describe('DamageAndSplitResolver', () => {
  let resolver: DamageAndSplitResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DamageAndSplitResolver, DamageAndSplitService],
    }).compile();

    resolver = module.get<DamageAndSplitResolver>(DamageAndSplitResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
