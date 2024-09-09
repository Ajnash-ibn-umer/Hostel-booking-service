import { Test, TestingModule } from '@nestjs/testing';
import { PropertyCategoryResolver } from '../property-category.resolver';
import { PropertyCategoryService } from '../property-category.service';

describe('PropertyCategoryResolver', () => {
  let resolver: PropertyCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyCategoryResolver, PropertyCategoryService],
    }).compile();

    resolver = module.get<PropertyCategoryResolver>(PropertyCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
