import { Module } from '@nestjs/common';
import { FileService } from 'src/utils/fileService.service';
import { DolarPricerController } from 'src/dolar-pricer/dolar-pricer.controller';
import { DolarPricerService } from 'src/dolar-pricer/dolar-pricer.service';

@Module({
  controllers: [DolarPricerController],
  providers: [DolarPricerService, FileService],
})
export class DolarPricerModule {}