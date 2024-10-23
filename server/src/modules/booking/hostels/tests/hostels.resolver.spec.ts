import { Test, TestingModule } from '@nestjs/testing';
import { HostelsResolver } from '../hostels.resolver';
import { HostelsService } from '../services/hostels.service';

describe('HostelsResolver', () => {
  let resolver: HostelsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HostelsResolver, HostelsService],
    }).compile();

    resolver = module.get<HostelsResolver>(HostelsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  }); 
});
