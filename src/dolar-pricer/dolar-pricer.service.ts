import { Injectable } from '@nestjs/common';
import { FileService } from 'src/utils/fileService.service';
import * as prices from 'src/files/all-prices.json';
import * as securitiesIds from 'src/files/securities-ids.json';
import { Currencies } from 'src/common/currencies.enum';
import { SettlementTypes } from 'src/common/settlementTypes.enum';
import { Symbols } from 'src/common/symbols.enum';

export interface IResponse {
  securityId: string;
  settlementType: string;
  dolarMep?: number;
  dolarCable?: number;
}

@Injectable()
export class DolarPricerService {
  private prices;
  private ids: { response: string[] };
  constructor(private readonly fileService: FileService) {
    this.refetchData();
    this.prices = prices.prices;
    this.ids = securitiesIds.securitiesIds;
  }

  private refetchData(): void {
    setInterval(async () => {
      console.log('new axios requests executed');
      await Promise.all([
        this.fileService.saveAllPrices(),
        this.fileService.saveAllSecuritiesIds(),
      ]);
    }, 1000 * 60 * 2);
  }

  async calculateDolarPrices(securityId: string): Promise<IResponse> {
    if (!this.ids.response.includes(securityId)) {
      throw new Error('Security ID not found in possible Securities Ids');
    }
    const {
      securityId: { response },
    } = await this.fileService.saveBySecurityId(securityId);

    const settlementType: string =
      response.settlementType == SettlementTypes.CI
        ? '0001'
        : response.settlementType == SettlementTypes.T1
        ? '0002'
        : '0003';

    // ej si me llega AL30-0003-C-CT-ARS
    // debo armar el  AL30D-0003-C-CT-USD y el AL30C-0003-C-CT-EXT
    if (
      response.symbol == Symbols.AL30 &&
      response.currency == Currencies.ARS
    ) {
      const dolarMepSecurityId = `${response.symbol}D-${settlementType}-C-CT-USD`;
      const dolarCableSecurityId = `${response.symbol}C-${settlementType}-C-CT-EXT`;
      const dolarMep =
        response.last.price / this.prices[dolarMepSecurityId]?.last?.price || 0;
      const dolarCable =
        response.last.price / this.prices[dolarCableSecurityId]?.last?.price ||
        0;
      return {
        securityId,
        settlementType: response.settlementType,
        dolarMep: this.round(dolarMep),
        dolarCable: this.round(dolarCable),
      };
    }
    // ej si me llega GD30-0001-C-CT-ARS
    // debo armar el  GD30C-0001-C-CT-USD y el GD30D-0001-C-CT-ARS-EXT
    if (
      response.symbol == Symbols.GD30 &&
      response.currency == Currencies.ARS
    ) {
      const dolarMepSecurityId = `${response.symbol}D-${settlementType}-C-CT-USD`;
      const dolarCableSecurityId = `${response.symbol}C-${settlementType}-C-CT-EXT`;
      const dolarMep =
        response.last.price / this.prices[dolarMepSecurityId]?.last?.price || 0;
      const dolarCable =
        response.last.price / this.prices[dolarCableSecurityId]?.last?.price ||
        0;
      return {
        securityId,
        settlementType: response.settlementType,
        dolarMep: this.round(dolarMep),
        dolarCable: this.round(dolarCable),
      };
    }
  }

  async calculateAllDolarPrices(): Promise<{
    dolarPrices: IResponse[];
  }> {
    const dolarTuples: string[][] = this.generateDolarTuples(this.prices);
    const dolarPrices = await Promise.all(
      dolarTuples.map(([securityId]) => this.calculateDolarPrices(securityId)),
    );
    return { dolarPrices };
  }

  private generateDolarTuples(pricesObj = {}): Array<string[]> {
    const dolarTuples: Array<string[]> = [];
    for (const key in pricesObj) {
      if (key.split('-')[0] == Symbols.AL30) {
        if (key.split('-')[1] == '0001' && key.split('-')[4] == 'ARS') {
          dolarTuples.push(['AL30-0001-C-CT-ARS', 'AL30D-0001-C-CT-USD']);
        }
        if (key.split('-')[1] == '0002' && key.split('-')[4] == 'ARS') {
          dolarTuples.push(['AL30-0002-C-CT-ARS', 'AL30D-0002-C-CT-USD']);
        }
        if (key.split('-')[1] == '0003' && key.split('-')[4] == 'ARS') {
          dolarTuples.push(['AL30-0003-C-CT-ARS', 'AL30D-0003-C-CT-USD']);
        }
      }
      if (key.split('-')[0] == Symbols.GD30) {
        if (key.split('-')[1] == '0001' && key.split('-')[4] == 'ARS') {
          dolarTuples.push(['GD30-0001-C-CT-ARS', 'GD30D-0001-C-CT-USD']);
        }
        if (key.split('-')[1] == '0003' && key.split('-')[4] == 'ARS') {
          dolarTuples.push(['GD30-0003-C-CT-ARS', 'GD30D-0003-C-CT-USD']);
        }
      }
    }
    return dolarTuples;
  }

  private round(val: number): number {
    return +(Math.round(val * 100) / 100).toFixed(2);
  }
}
