
const leadingSymbolToName: Record<string, string> = {
  '0': 'zeroes',
  '1': 'ones',
  '2': 'twos',
  '3': 'threes',
  '4': 'fours',
  '5': 'fives',
  '6': 'sixes',
  '7': 'sevens',
  '8': 'eights',
  '9': 'nines',

  a: 'As',
  b: 'Bs',
  c: 'Cs',
  d: 'Ds',
  e: 'Es',
  f: 'Fs',
};

export const getAddressDescription = (address: string): string => {
  // if address has leading symbols
  let leadingSymbol = address[2].toLowerCase();
  for (let i = 0; i < 40; i++) {
    if (address[i + 2] !== leadingSymbol.toLowerCase()) {
      if (i < 5) {
        break;
      }
      return `${i} leading ${leadingSymbolToName[leadingSymbol.toLowerCase()] ?? leadingSymbol}`;
    }
  }

  return '';
};
