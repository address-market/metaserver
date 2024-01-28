
const leadingSymbolToName: Record<string, string> = {
  '0': 'zeroes',
  '1': 'numbers',
  '2': 'numbers',
  '3': 'numbers',
  '4': 'numbers',
  '5': 'numbers',
  '6': 'numbers',
  '7': 'numbers',
  '8': 'numbers',
  '9': 'numbers',

  a: 'letters',
  b: 'letters',
  c: 'letters',
  d: 'letters',
  e: 'letters',
  f: 'letters',
};

export const getAddressDescription = (address: string): string => {
  // if address has leading symbols
  let leadingSymbol = address[2].toLowerCase();
  for (let i = 0; i < 40; i++) {
    if (address[i + 2].toLowerCase() !== leadingSymbol.toLowerCase()) {
      if (i < 5) {
        break;
      }
      return `${i} leading ${leadingSymbolToName[leadingSymbol.toLowerCase()] ?? leadingSymbol}`;
    }
  }

  // if (address.toLowerCase().startsWith('0x3aeba1')) {
  //   return 'Заебал';
  // }

  return '';
};
