"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleAppController = void 0;
const common_1 = require("@nestjs/common");
const npm_auto_data_1 = require("@yml/npm-auto-data");
const validators_1 = require("./validators");
let SampleAppController = class SampleAppController {
    constructor(autoDataService) {
        this.autoDataService = autoDataService;
    }
    async getVehicleDetailsByVin(vin) {
        const valid = (0, validators_1.validateVin)(vin);
        if (valid) {
            return await this.autoDataService.getVehicleDetailsByVin(vin);
        }
        throw new common_1.HttpException('Invalid Vin', common_1.HttpStatus.BAD_REQUEST);
    }
    async getVehicleDetailsReportByVin(vin) {
        const valid = (0, validators_1.validateVin)(vin);
        if (valid) {
            return await this.autoDataService.generateReport(vin);
        }
        throw new common_1.HttpException('Invalid Vin', common_1.HttpStatus.BAD_REQUEST);
    }
};
__decorate([
    (0, common_1.Get)(':vin/vin-details'),
    __param(0, (0, common_1.Param)('vin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SampleAppController.prototype, "getVehicleDetailsByVin", null);
__decorate([
    (0, common_1.Get)(':vin/report'),
    __param(0, (0, common_1.Param)('vin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SampleAppController.prototype, "getVehicleDetailsReportByVin", null);
SampleAppController = __decorate([
    (0, common_1.Controller)('vehicle'),
    __metadata("design:paramtypes", [npm_auto_data_1.AutoDataServiceLib])
], SampleAppController);
exports.SampleAppController = SampleAppController;
//# sourceMappingURL=app.controller.js.map