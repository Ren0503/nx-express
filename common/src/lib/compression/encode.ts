import { num_to_s } from './number';

export function encodeNum(num: number): string {
  const a = 'n|' + num_to_s(num);
  return a;
  // let b = num.toString()
  // return a.length < b.length ? a : num
}

export function encodeBool(b: boolean): string {
  // return 'b|' + bool_to_s(b)
  return b ? 'b|T' : 'b|F';
}

export function encodeStr(str: string): string {
  const prefix = str[0] + str[1];
  switch (prefix) {
    case 'b|':
    case 'o|':
    case 'n|':
    case 'a|':
    case 's|':
      str = 's|' + str;
  }
  return str;
}
