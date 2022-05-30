import { Test, TestingModule } from '@nestjs/testing';
import { DolarPricerService } from 'src/dolar-pricer/dolar-pricer.service';
import { FileService } from 'src/utils/fileService.service';

describe('DolarPricerService', () => {
  let service: DolarPricerService;
  const IResponseMock = {
    securityId: 'GD30-0003-C-CT-ARS',
    settlementType: '48hs',
    dolarMep: 0,
    dolarCable: 0,
  };
  const FileServiceMock = {
    saveBySecurityId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DolarPricerService,
        {
          provide: FileService,
          useValue: FileServiceMock,
        },
      ],
    }).compile();
    service = module.get<DolarPricerService>(DolarPricerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDolarPrices', () => {
    it('should return a IResponse object when all validations are passed', async () => {
      jest
        .spyOn(service, 'calculateDolarPrices')
        .mockImplementation()
        .mockResolvedValue(IResponseMock);
      const result = await service.calculateDolarPrices(
        IResponseMock.securityId,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(IResponseMock);
    });

    it('should throw error when security id passed is incorrect', async () => {
      jest
        .spyOn(service, 'calculateDolarPrices')
        .mockImplementation()
        .mockResolvedValue(undefined);
      try {
        await service.calculateDolarPrices('incorrect-security-id');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
