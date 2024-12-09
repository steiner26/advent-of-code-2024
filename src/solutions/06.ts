import {
  createCopyWithValue,
  getCharacterAtCoordinate,
  getFirstCoordinateOfCharacter,
} from '../utils/arrayUtils';
import { Angle, Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

const getNumberOfPositionsVisited = (input: string[]) => {
  let direction = Direction.UP;
  let coordinate = getFirstCoordinateOfCharacter(input, '^');
  let nextCoordinate = coordinate.add(direction);
  let nextCharacter = getCharacterAtCoordinate(input, nextCoordinate);
  const visited = new Set([coordinate.toString()]);

  while (nextCharacter) {
    if (nextCharacter === '#') {
      direction = direction.rotate(Angle.DEGREES_270);
    } else {
      coordinate = coordinate.add(direction);
      visited.add(coordinate.toString());
    }
    nextCoordinate = coordinate.add(direction);
    nextCharacter = getCharacterAtCoordinate(input, nextCoordinate);
  }

  return visited.size;
};

const checkIfCreatesLoop = (
  input: string[],
  extraObstacleCoordinate: Coordinate,
) => {
  let direction = Direction.UP;
  let coordinate = getFirstCoordinateOfCharacter(input, '^');
  let nextCoordinate = coordinate.add(direction);
  let nextCharacter = getCharacterAtCoordinate(input, nextCoordinate);
  const tracker = createCopyWithValue(input, () => [] as Direction[]);
  while (nextCharacter) {
    if (
      nextCharacter === '#' ||
      nextCoordinate.equals(extraObstacleCoordinate)
    ) {
      direction = direction.rotate(Angle.DEGREES_270);
    } else {
      coordinate = coordinate.add(direction);
      if (tracker[coordinate.y][coordinate.x].includes(direction)) {
        return true;
      }
      tracker[coordinate.y][coordinate.x].push(direction);
    }
    nextCoordinate = coordinate.add(direction);
    nextCharacter = getCharacterAtCoordinate(input, nextCoordinate);
  }
  return false;
};

const getNumberOfPotentialLoops = (input: string[]) => {
  let numPotentialLoops = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const potentialObstuctionCoordinate = new Coordinate(x, y);
      if (
        getCharacterAtCoordinate(input, potentialObstuctionCoordinate) ===
          '.' &&
        checkIfCreatesLoop(input, potentialObstuctionCoordinate)
      ) {
        numPotentialLoops++;
      }
    }
  }
  return numPotentialLoops;
};

export default async function solution() {
  const input = await readLines('/data/06.txt');

  const numPositionsVisited = getNumberOfPositionsVisited(input);
  // 5312
  console.log('guard will visit ' + numPositionsVisited + ' total positions');

  const numPotentialLoops = getNumberOfPotentialLoops(input);
  // 1748
  console.log(
    'there are ' + numPotentialLoops + ' locations that would cause a loop',
  );
}
