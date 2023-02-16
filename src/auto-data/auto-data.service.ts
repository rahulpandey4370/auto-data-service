import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IVehicleDetailsByVinResponse,
  IVehicleInfoDBInfo,
} from '../interfaces/vehicle.interface';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
import * as suid from 'suid';
import { ConfigService } from '@nestjs/config';
import { generatePdf } from '../utils/generate-pdf.util';

@Injectable()
export class AutoDataServiceLib {
  constructor(private configService: ConfigService) {}
  async getVehicleDetailsByVin(
    vin: string
  ): Promise<IVehicleDetailsByVinResponse> {
    return await this.getVehicleByVin(vin);
  }

  private generateSecretDigest = (
    nonce: string,
    timestamp: number,
    appSecret: string
  ): string => {
    const baseString = nonce + timestamp.toString() + appSecret;
    return CryptoJS.SHA1(baseString).toString(CryptoJS.enc.Base64);
  };

  private generateAutoDataToken = (
    realm: string,
    appId: string,
    nonce: string,
    secretDigest: string,
    timestamp: number
  ): string => {
    return `${this.configService.get<string>(
      'JD_POWER_CONSTANTS.autodata_name'
    )} realm="${realm}",chromedata_app_id="${appId}",chromedata_nonce="${nonce}",chromedata_secret_digest="${secretDigest}",chromedata_digest_method="SHA1",chromedata_version="1.0",chromedata_timestamp="${timestamp}"`;
  };

  private getAutoDataInformation = async (
    vin: string
  ): Promise<IVehicleInfoDBInfo> => {
    const realm = this.configService.get<string>(
      'JD_POWER_CONSTANTS.autodata_realm'
    );
    const appId = this.configService.get<string>('appId');
    const appSecret = this.configService.get<string>('appSecret');
    const timestamp = Date.now();
    const nonce = suid.better();
    const secretDigest = this.generateSecretDigest(nonce, timestamp, appSecret);
    const token = this.generateAutoDataToken(
      realm,
      appId,
      nonce,
      secretDigest,
      timestamp
    );
    const endpoint = `${this.configService.get<string>(
      'JD_POWER_CONSTANTS.autodata_api_url'
    )}/vin/${vin}?language_Locale=${this.configService.get<string>(
      'autodata_language'
    )}`;
    const config = {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };
    const response = await axios(endpoint, config);

    // Invalid response payload if error is true or result object is undefined
    if (response.data?.error || !response.data?.result) {
      throw new HttpException(
        'Invalid response payload/ Invalid VIN',
        HttpStatus.BAD_REQUEST
      );
    }
    if (response.data.result.validVin) {
      return response.data.result;
    }
  };

  private getVehicleByVin = async (
    vin: string
  ): Promise<IVehicleDetailsByVinResponse> => {
    const results = await this.getAutoDataInformation(vin);
    // Avoid unexpected errors when trying to access to object members
    // by using a default data structure `[]` in this case:
    const vehicles = results.vehicles ?? [];
    const exteriorColors = results.exteriorColors ?? [];

    const details = {
      vin,
      year: isNaN(+results.year) ? undefined : +results.year,
      make: results.make,
      model: results.model,
      trim: vehicles[0]?.trim,
      color: exteriorColors[0]?.genericDesc,
      colorHex: exteriorColors[0]?.rgbHexValue ?? '',
      styleId: vehicles[0]?.styleId ?? '',
    };
    return details;
  };

  generateReport = async (vin: string): Promise<unknown> => {
    const result = await this.getAutoDataInformation(vin);
    return generatePdf({ data: result });
  };
}
