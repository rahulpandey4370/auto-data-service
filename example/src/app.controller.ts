import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AutoDataServiceLib } from '@yml/npm-auto-data';
import { validateVin } from './validators';

@Controller('vehicle')
export class SampleAppController {
  constructor(private readonly autoDataService: AutoDataServiceLib) {}

  @Get(':vin/vin-details')
  async getVehicleDetailsByVin(@Param('vin') vin: string): Promise<object> {
    const valid = validateVin(vin);
    if (valid) {
      return await this.autoDataService.getVehicleDetailsByVin(vin);
    }
    throw new HttpException('Invalid Vin', HttpStatus.BAD_REQUEST);
  }

  @Get(':vin/report')
  async getVehicleDetailsReportByVin(
    @Param('vin') vin: string,
  ): Promise<unknown> {
    const valid = validateVin(vin);
    if (valid) {
      return await this.autoDataService.generateReport(vin);
    }
    throw new HttpException('Invalid Vin', HttpStatus.BAD_REQUEST);
  }
}
