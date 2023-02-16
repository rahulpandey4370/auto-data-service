export interface IVehicleDetailsByVinResponse {
    readonly vin: string;
    readonly year?: number;
    readonly make: string;
    readonly model: string;
    readonly trim: string;
    readonly color: string;
    colorHex: string;
    styleId: string;
}
export interface IVehicleInfoDBInfo {
    readonly make: string;
    readonly model: string;
    readonly trim: string;
    readonly year: string;
    readonly exteriorColors: string;
    readonly vehicle: string;
    readonly vehicles: string;
    styleId: string;
}
