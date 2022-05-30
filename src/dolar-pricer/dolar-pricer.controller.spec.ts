import { Test, TestingModule } from '@nestjs/testing';
import { DolarPricerController } from 'src/dolar-pricer/dolar-pricer.controller';
import { DolarPricerService } from 'src/dolar-pricer/dolar-pricer.service';
import { FileService } from 'src/utils/fileService.service';
import * as prices from 'src/files/all-prices.json';
import * as securitiesIds from 'src/files/securities-ids.json';

describe('DolarPricerController', () => {
  const IResponseMock = {
    securityId: 'AL30-0003-C-CT-ARS',
    settlementType: '48hs',
    dolarMep: 169.02,
    dolarCable: 165.01,
  };
  const DolarPricerServiceMock = {
    calculateDolarPrices: jest.fn(),
  };
  const FileServiceMock = {
    saveAllPrices: jest.fn().mockResolvedValue(prices),
    saveAllSecuritiesIds: jest.fn().mockResolvedValue(securitiesIds),
  };
  let controller: DolarPricerController;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DolarPricerController,
        {
          provide: DolarPricerService,
          useValue: DolarPricerServiceMock,
        },
        {
          provide: FileService,
          useValue: FileServiceMock,
        },
      ],
    }).compile();
    controller = module.get<DolarPricerController>(DolarPricerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('save-prices endpoint controller', () => {
    beforeAll(() => {
      FileServiceMock.saveAllPrices();
    });
    it('should call saveAllPrices method of FileService', async () => {
      const result = await controller.saveAllPrices();
      expect(FileServiceMock.saveAllPrices).toHaveBeenCalled();
      expect(result).toMatchObject(prices);
    });
  });

  describe('save-securities-ids endpoint controller', () => {
    beforeAll(() => {
      FileServiceMock.saveAllSecuritiesIds();
    });
    it('should call saveAllSecuritiesIds method of FileService', async () => {
      const result = await controller.saveAllSecuritiesIds();
      expect(FileServiceMock.saveAllSecuritiesIds).toHaveBeenCalled();
      expect(result).toMatchObject(securitiesIds);
    });
  });

  describe('calculate-dolar-prices endpoint controller', () => {
    beforeAll(() => {
      DolarPricerServiceMock.calculateDolarPrices.mockResolvedValue(
        IResponseMock,
      );
    });

    it('should call calculateDolarPrices method of DolarPricerService', async () => {
      const result = await controller.calculateDolarPrices(
        IResponseMock.securityId,
      );
      expect(DolarPricerServiceMock.calculateDolarPrices).toHaveBeenCalled();
      expect(result).toEqual(IResponseMock);
    });
  });
});
