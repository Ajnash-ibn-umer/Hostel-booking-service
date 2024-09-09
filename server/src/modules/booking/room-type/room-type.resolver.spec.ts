import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypeResolver } from './room-type.resolver';
import { RoomTypeService } from './room-type.service';

describe('RoomTypeResolver', () => {
  let resolver: RoomTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomTypeResolver, RoomTypeService],
    }).compile();

    resolver = module.get<RoomTypeResolver>(RoomTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
