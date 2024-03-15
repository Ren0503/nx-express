import { decode } from './decode';
import {
  Value,
  Key,
  Memory,
  addValue,
  makeInMemoryMemory,
  memToValues,
} from './memory';

export type Values = Value[];
export type Compressed = [Values, Key]; // [values, root]

export function compress(o: object): Compressed {
  const mem: Memory = makeInMemoryMemory();
  const root = addValue(mem, o);
  const values = memToValues(mem);

  return [values, root];
}

export function decompress(c: Compressed) {
  const [values, root] = c;
  return decode(values, root);
}
