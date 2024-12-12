import {
  createCopyWithValue,
  getCharacterAtCoordinate,
} from '../utils/arrayUtils';
import { Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

const getTrailHeadsStartingAtCoordinate = (
  input: string[],
  coordinate: Coordinate,
) => {
  const trailHeads: Coordinate[][] = [];
  const height = getCharacterAtCoordinate(input, coordinate);
  if (height === '9') {
    return [[coordinate]];
  }
  for (const direction of [
    Direction.RIGHT,
    Direction.UP,
    Direction.LEFT,
    Direction.DOWN,
  ]) {
    const nextCoordinate = coordinate.add(direction);
    const nextHeight = getCharacterAtCoordinate(input, nextCoordinate);
    if (Number(height) + 1 === Number(nextHeight)) {
      const result = getTrailHeadsStartingAtCoordinate(input, nextCoordinate);
      result.forEach(r => {
        trailHeads.push([coordinate, ...r]);
      });
    }
  }
  return trailHeads;
};

const createTrailheadMap = (input: string[]) => {
  const trailheadsMap = createCopyWithValue(input, () => [] as Coordinate[][]);
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      if (getCharacterAtCoordinate(input, coordinate) === '0') {
        const trailHeads = getTrailHeadsStartingAtCoordinate(input, coordinate);
        trailheadsMap[y][x] = trailHeads;
      }
    }
  }
  return trailheadsMap;
};

const findUniqueEndpoints = (trails: Coordinate[][]) => {
  return new Set(trails.map(t => t[9].toString())).size;
};

const sumTrailheadScores = (trailheads: Coordinate[][][][]) => {
  return trailheads.reduce(
    (accm, row) =>
      accm +
      row.reduce((accm, trails) => accm + findUniqueEndpoints(trails), 0),
    0,
  );
};

const sumTrailheadRatings = (trailheads: Coordinate[][][][]) => {
  return trailheads.reduce(
    (accm, row) => accm + row.reduce((accm, trails) => accm + trails.length, 0),
    0,
  );
};

export default async function solution() {
  const input = await readLines('/data/10.txt');
  const trailheads = createTrailheadMap(input);

  const sumOfTrailheadScores = sumTrailheadScores(trailheads);
  // 644
  console.log('the sum of trailhead scores is ' + sumOfTrailheadScores);

  const sumOfTrailheadRatings = sumTrailheadRatings(trailheads);
  // 1366
  console.log('the sum of trailhead ratings is ' + sumOfTrailheadRatings);
}
