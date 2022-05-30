import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class FileService {
  async saveAllPrices(): Promise<{
    prices: any;
  }> {
    return axios
      .get(`${process.env.PRICES_URL}`)
      .then((res) => {
        const obj = {
          prices: res.data,
        };
        const pricesPath = path.join(
          process.cwd(),
          'src/files/all-prices.json',
        );
        fs.writeFileSync(pricesPath, JSON.stringify(obj, null, 2));
        return obj;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  async saveAllSecuritiesIds(): Promise<{
    securitiesIds: string[];
  }> {
    return axios
      .get(`${process.env.SECURITIES_ID_URL}`)
      .then((res) => {
        const obj = {
          securitiesIds: res.data,
        };
        const securitiesIdsPath = path.join(
          process.cwd(),
          'src/files/securities-ids.json',
        );
        fs.writeFileSync(securitiesIdsPath, JSON.stringify(obj, null, 2));
        return obj;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  async saveBySecurityId(securityId: string): Promise<{
    securityId: any;
  }> {
    return axios
      .get(`${process.env.BASE_URL}/${securityId}`)
      .then((res) => {
        const obj = {
          securityId: res.data,
        };
        const secIdPath = path.join(
          process.cwd(),
          'src/files/price-security-id.json',
        );
        fs.writeFileSync(secIdPath, JSON.stringify(obj, null, 2));
        return obj;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}
