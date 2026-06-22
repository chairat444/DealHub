import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CacheService } from '../../../infrastructure/cache/cache.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrisma = {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn(),
    },
    searchLog: { create: jest.fn() },
  };

  const mockCache = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCache.get.mockResolvedValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CacheService, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search products', async () => {
    const result = await service.search({ q: 'iphone' });
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('meta');
    expect(mockPrisma.product.findMany).toHaveBeenCalled();
  });

  it('should return cached results', async () => {
    const cached = { items: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    mockCache.get.mockResolvedValueOnce(cached);
    const result = await service.search({ q: 'test' });
    expect(result).toEqual(cached);
    expect(mockPrisma.product.findMany).not.toHaveBeenCalled();
  });
});
