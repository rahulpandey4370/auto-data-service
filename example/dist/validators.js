"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVin = void 0;
const validateVin = (vin) => {
    if (undefined !== vin && vin.length === 17)
        return true;
    else
        return false;
};
exports.validateVin = validateVin;
//# sourceMappingURL=validators.js.map