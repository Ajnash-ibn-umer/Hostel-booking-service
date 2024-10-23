import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCategoryService } from '../property-category.service';

describe('PropertyCategoryService', () => {
  let service: PropertyCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyCategoryService],
    }).compile();

    service = module.get<PropertyCategoryService>(PropertyCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
