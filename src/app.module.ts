import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DolarPricerModule } from './dolar-pricer/dolar-pricer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.development`],
      isGlobal: true,
    }),
    DolarPricerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
