/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import { Values } from './core';
import { throwUnknownDataType } from './error';
import { Key } from './memory';
import { s_to_num, s_to_int } from './number';

export function decodeNum(s: string): number {
  s = s.replace('n|', '');
  return s_to_num(s);
}

export function decodeKey(key: Key): number {
  return typeof key === 'number' ? key : s_to_int(key);
}

export function decodeBool(s: string): boolean {
  switch (s) {
    case 'b|T':
      return true;
    case 'b|F':
      return false;
  }
  return !!s;
}

export function decodeStr(s: string): string {
  const prefix = s[0] + s[1];
  return prefix === 's|' ? s.substr(2) : s;
}

function decodeObject(values: Values, s: string) {
  if (s === 'o|') {
    return {};
  }
  const o = {} as any;
  const vs = s.split('|');
  const key_id = vs[1];
  let keys = decode(values, key_id);
  const n = vs.length;
  if (n - 2 === 1 && !Array.isArray(keys)) {
    // single-key object using existing value as key
    keys = [keys];
  }
  for (let i = 2; i < n; i++) {
    const k = keys[i - 2];
    let v = vs[i];
    v = decode(values, v);
    o[k] = v;
  }
  return o;
}

function decodeArray(values: Values, s: string) {
  if (s === 'a|') {
    return [];
  }
  const vs = s.split('|');
  const n = vs.length - 1;
  const xs: any[] = new Array(n);
  for (let i = 0; i < n; i++) {
    let v = vs[i + 1];
    v = decode(values, v);
    xs[i] = v;
  }
  return xs;
}

export function decode(values: Values, key: Key) {
  if (key === '' || key === '_') {
    return null;
  }
  const id = decodeKey(key);
  const v = values[id];
  if (v === null) {
    return v;
  }
  switch (typeof v) {
    case 'undefined':
      return v;
    case 'number':
      return v;
    case 'string':
      const prefix = v[0] + v[1];
      switch (prefix) {
        case 'b|':
          return decodeBool(v);
        case 'o|':
          return decodeObject(values, v);
        case 'n|':
          return decodeNum(v);
        case 'a|':
          return decodeArray(values, v);
        default:
          return decodeStr(v);
      }
  }
  return throwUnknownDataType(v);
}
