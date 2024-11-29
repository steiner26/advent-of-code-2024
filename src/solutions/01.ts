import { readLines } from '../utils/io';

export default async function solution() {
  const lines = await readLines('/data/01.txt');
  lines.forEach(line => console.log(line));
}
