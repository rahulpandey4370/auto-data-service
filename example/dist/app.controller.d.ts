import { AutoDataServiceLib } from '@yml/npm-auto-data';
export declare class SampleAppController {
    private readonly autoDataService;
    constructor(autoDataService: AutoDataServiceLib);
    getVehicleDetailsByVin(vin: string): Promise<object>;
    getVehicleDetailsReportByVin(vin: string): Promise<unknown>;
}
