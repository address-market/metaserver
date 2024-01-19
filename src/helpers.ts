import { checksumAddress } from "viem";

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const uint256ToAddress = (uint256: string): string => {
  return checksumAddress(('0x' + BigInt(uint256).toString(16).padStart(40, '0')) as `0x${string}`);
};
