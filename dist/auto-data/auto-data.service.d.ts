import { IVehicleDetailsByVinResponse } from '../interfaces/vehicle.interface';
import { ConfigService } from '@nestjs/config';
export declare class AutoDataServiceLib {
    private configService;
    constructor(configService: ConfigService);
    getVehicleDetailsByVin(vin: string): Promise<IVehicleDetailsByVinResponse>;
    private generateSecretDigest;
    private generateAutoDataToken;
    private getAutoDataInformation;
    private getVehicleByVin;
    generateReport: (vin: string) => Promise<unknown>;
}
