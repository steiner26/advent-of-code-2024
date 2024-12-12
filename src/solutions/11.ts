import { readLines } from '../utils/io';

type Memo = {
  [stone: string]: number;
};

const processStoneRecursive = (
  stone: string,
  times: number,
  memo: Memo[],
): number => {
  if (times === 0) {
    return 1;
  }
  const memoizedValue = memo[times][stone];
  if (memoizedValue) {
    return memoizedValue;
  }
  if (stone === '0') {
    const recursiveResult = processStoneRecursive('1', times - 1, memo);
    memo[times][stone] = recursiveResult;
    return recursiveResult;
  }
  if (stone.length % 2 === 0) {
    const firstHalf = stone.slice(0, stone.length / 2);
    const secondHalf = stone.slice(stone.length / 2);
    const recursiveResult =
      processStoneRecursive(String(Number(firstHalf)), times - 1, memo) +
      processStoneRecursive(String(Number(secondHalf)), times - 1, memo);
    memo[times][stone] = recursiveResult;
    return recursiveResult;
  }
  const recursiveResult = processStoneRecursive(
    String(Number(stone) * 2024),
    times - 1,
    memo,
  );
  memo[times][stone] = recursiveResult;
  return recursiveResult;
};

const processStone = (stone: string) => {
  if (stone === '0') {
    return ['1'];
  }
  if (stone.length % 2 === 0) {
    const firstHalf = stone.slice(0, stone.length / 2);
    const secondHalf = stone.slice(stone.length / 2);
    return [String(Number(firstHalf)), String(Number(secondHalf))];
  }
  return [String(Number(stone) * 2024)];
};

const processStones = (stones: string[], times: number) => {
  let oldStones = [...stones];
  let newStones = [];
  while (times > 0) {
    for (const stone of oldStones) {
      newStones.push(...processStone(stone));
    }
    oldStones = newStones;
    newStones = [];
    times -= 1;
  }
  return oldStones;
};

export default async function solution() {
  const [input] = await readLines('/data/11.txt');
  const stones = input.split(' ');

  const finalStonesAfter25Blinks = processStones(stones, 25);
  // 217812
  console.log(
    'there are ' + finalStonesAfter25Blinks.length + ' stones after 25 blinks',
  );

  const finalStonesAfter75Blinks = stones.reduce(
    (accm, stone) =>
      accm +
      processStoneRecursive(
        stone,
        75,
        new Array(76).fill(null).map(() => ({}) as Memo),
      ),
    0,
  );
  // 259112729857522
  console.log(
    'there are ' + finalStonesAfter75Blinks + ' stones after 75 blinks',
  );
}
