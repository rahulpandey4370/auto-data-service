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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDataServiceLib = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = require("crypto-js");
const axios_1 = require("axios");
const suid = require("suid");
const config_1 = require("@nestjs/config");
const generate_pdf_util_1 = require("../utils/generate-pdf.util");
let AutoDataServiceLib = class AutoDataServiceLib {
    constructor(configService) {
        this.configService = configService;
        this.generateSecretDigest = (nonce, timestamp, appSecret) => {
            const baseString = nonce + timestamp.toString() + appSecret;
            return CryptoJS.SHA1(baseString).toString(CryptoJS.enc.Base64);
        };
        this.generateAutoDataToken = (realm, appId, nonce, secretDigest, timestamp) => {
            return `${this.configService.get('JD_POWER_CONSTANTS.autodata_name')} realm="${realm}",chromedata_app_id="${appId}",chromedata_nonce="${nonce}",chromedata_secret_digest="${secretDigest}",chromedata_digest_method="SHA1",chromedata_version="1.0",chromedata_timestamp="${timestamp}"`;
        };
        this.getAutoDataInformation = (vin) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const realm = this.configService.get('JD_POWER_CONSTANTS.autodata_realm');
            const appId = this.configService.get('appId');
            const appSecret = this.configService.get('appSecret');
            const timestamp = Date.now();
            const nonce = suid.better();
            const secretDigest = this.generateSecretDigest(nonce, timestamp, appSecret);
            const token = this.generateAutoDataToken(realm, appId, nonce, secretDigest, timestamp);
            const endpoint = `${this.configService.get('JD_POWER_CONSTANTS.autodata_api_url')}/vin/${vin}?language_Locale=${this.configService.get('autodata_language')}`;
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            };
            const response = yield (0, axios_1.default)(endpoint, config);
            if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.error) || !((_b = response.data) === null || _b === void 0 ? void 0 : _b.result)) {
                throw new common_1.HttpException('Invalid response payload/ Invalid VIN', common_1.HttpStatus.BAD_REQUEST);
            }
            if (response.data.result.validVin) {
                return response.data.result;
            }
        });
        this.getVehicleByVin = (vin) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d, _e, _f, _g, _h, _j, _k;
            const results = yield this.getAutoDataInformation(vin);
            const vehicles = (_c = results.vehicles) !== null && _c !== void 0 ? _c : [];
            const exteriorColors = (_d = results.exteriorColors) !== null && _d !== void 0 ? _d : [];
            const details = {
                vin,
                year: isNaN(+results.year) ? undefined : +results.year,
                make: results.make,
                model: results.model,
                trim: (_e = vehicles[0]) === null || _e === void 0 ? void 0 : _e.trim,
                color: (_f = exteriorColors[0]) === null || _f === void 0 ? void 0 : _f.genericDesc,
                colorHex: (_h = (_g = exteriorColors[0]) === null || _g === void 0 ? void 0 : _g.rgbHexValue) !== null && _h !== void 0 ? _h : '',
                styleId: (_k = (_j = vehicles[0]) === null || _j === void 0 ? void 0 : _j.styleId) !== null && _k !== void 0 ? _k : '',
            };
            return details;
        });
        this.generateReport = (vin) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getAutoDataInformation(vin);
            return (0, generate_pdf_util_1.generatePdf)({ data: result });
        });
    }
    getVehicleDetailsByVin(vin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getVehicleByVin(vin);
        });
    }
};
AutoDataServiceLib = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AutoDataServiceLib);
exports.AutoDataServiceLib = AutoDataServiceLib;
