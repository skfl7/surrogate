export const StringConversion = (
  value: number,
  signRequired: boolean,
  symbolRequired: boolean,
  showDecimal: boolean
) => {
  let isNegative = false;
  let isPositive = false;

  //Set Sign
  if (value < 0) isNegative = true;
  else if (value > 0) isPositive = true;

  const val = Math.abs(value);
  let converVal = '';
  converVal = val.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimal ? 2 : 0,
    minimumFractionDigits: showDecimal ? 2 : 0,
  });

  // Adding +ve or -ve sign
  if (isNegative) converVal = '-' + converVal;
  else if (signRequired && isPositive) {
    converVal = '+' + converVal;
  }

  // Adding Rupee Symbol
  if (symbolRequired) converVal = '₹ ' + converVal;

  return converVal;
};
