import { countDecimals } from "../validators/blockchain";

function solNumberToDecimal(amount: string, decimals: number): string {
  let integer: string;
  let decimal: string;

  if (amount.length < decimals) {
    integer = "0";
    const padZeros = decimals - amount.length;
    decimal = `${"0".repeat(padZeros)}${amount}`;
  } else {
    integer = amount.slice(0, -decimals);
    if (integer.length === 0) {
      integer = "0";
    }

    decimal = amount.slice(-decimals);
  }

  // Remove trailing zeros
  decimal = decimal.replace(/0+$/, "");
  if (decimal.length === 0) {
    return integer;
  }

  return `${integer}.${decimal}`;
}

function decimalToSolNumber(decimalAmount: string, decimals: number): string {
  const uniformAmountFormat = decimalAmount.replace(",", ".");
  const nDecimals = countDecimals(uniformAmountFormat);
  const zeros = "0".repeat(decimals - nDecimals);

  let solAmount = `${uniformAmountFormat.replace(".", "")}${zeros}`;
  solAmount = solAmount.replace(/^0+/, "");

  if (solAmount.length === 0) {
    return "0";
  } else return solAmount;
}

export { solNumberToDecimal, decimalToSolNumber };
