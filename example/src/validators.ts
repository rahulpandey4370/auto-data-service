export const validateVin = (vin: string): boolean => {
  if (undefined !== vin && vin.length === 17) return true;
  else return false;
};
