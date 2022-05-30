import { Controller, Get, Param } from '@nestjs/common';
import {
  DolarPricerService,
  IResponse,
} from 'src/dolar-pricer/dolar-pricer.service';
import { FileService } from 'src/utils/fileService.service';

@Controller('dolar-pricer')
export class DolarPricerController {
  constructor(
    private readonly dolarPricerService: DolarPricerService,
    private readonly fileService: FileService,
  ) {}

  @Get('save-prices')
  async saveAllPrices() {
    return this.fileService.saveAllPrices();
  }

  @Get('save-securities-ids')
  async saveAllSecuritiesIds(): Promise<{
    securitiesIds: string[];
  }> {
    return this.fileService.saveAllSecuritiesIds();
  }

  @Get('/:securityId/calculate-dolar-prices')
  async calculateDolarPrices(
    @Param('securityId') securityId: string,
  ): Promise<IResponse> {
    return this.dolarPricerService.calculateDolarPrices(securityId);
  }

  @Get('/all-prices')
  async calculateAllDolarPrices(): Promise<{
    dolarPrices: IResponse[];
  }> {
    return this.dolarPricerService.calculateAllDolarPrices();
  }
}
