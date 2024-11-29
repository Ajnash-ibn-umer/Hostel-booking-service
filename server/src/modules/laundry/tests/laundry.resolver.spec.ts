import { Test, TestingModule } from '@nestjs/testing';
import { LaundryResolver } from '../laundry.resolver';
import { LaundryService } from '../laundry.service';

describe('LaundryResolver', () => {
  let resolver: LaundryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaundryResolver, LaundryService],
    }).compile();

    resolver = module.get<LaundryResolver>(LaundryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
