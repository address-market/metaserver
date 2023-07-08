import { BigNumber } from "ethers";

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const uint256ToAddress = (uint256: string): string => {
  const bnInHex = BigNumber.from(uint256).toHexString();
  return '0x' + bnInHex.slice(2).padStart(40, '0');
};
