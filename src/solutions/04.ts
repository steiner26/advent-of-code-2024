import { readLines } from '../utils/io';
import { Direction, Coordinate } from '../utils/coordinate';

const getLetterAtCoordinate = (input: string[], coordinate: Coordinate) => {
  if (coordinate.x < 0 || coordinate.x >= input[0].length) {
    return null;
  }

  if (coordinate.y < 0 || coordinate.y >= input.length) {
    return null;
  }

  return input[coordinate.y].charAt(coordinate.x);
};

const getTotalXMASStartingAtCoordinate = (
  input: string[],
  coordinate: Coordinate,
) => {
  if (getLetterAtCoordinate(input, coordinate) !== 'X') {
    return 0;
  }

  return Direction.ORDER.reduce((totalXMAS, direction) => {
    const mCoordinate = coordinate.add(direction);
    if (getLetterAtCoordinate(input, mCoordinate) !== 'M') {
      return totalXMAS;
    }

    const aCoordinate = mCoordinate.add(direction);
    if (getLetterAtCoordinate(input, aCoordinate) !== 'A') {
      return totalXMAS;
    }

    const sCoordinate = aCoordinate.add(direction);
    if (getLetterAtCoordinate(input, sCoordinate) !== 'S') {
      return totalXMAS;
    }

    return totalXMAS + 1;
  }, 0);
};

const isCenterOfMASCross = (input: string[], coordinate: Coordinate) => {
  if (getLetterAtCoordinate(input, coordinate) !== 'A') {
    return false;
  }

  const diagonal1 = [
    getLetterAtCoordinate(input, coordinate.add(Direction.UP_RIGHT)),
    getLetterAtCoordinate(input, coordinate.add(Direction.DOWN_LEFT)),
  ];

  if (!diagonal1.includes('M') || !diagonal1.includes('S')) {
    return false;
  }

  const diagonal2 = [
    getLetterAtCoordinate(input, coordinate.add(Direction.UP_LEFT)),
    getLetterAtCoordinate(input, coordinate.add(Direction.DOWN_RIGHT)),
  ];

  if (!diagonal2.includes('M') || !diagonal2.includes('S')) {
    return false;
  }

  return true;
};

export default async function solution() {
  const input = await readLines('/data/04.txt');

  let totalXMASFound = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      totalXMASFound += getTotalXMASStartingAtCoordinate(input, coordinate);
    }
  }

  // 2644
  console.log('total XMAS found is ' + totalXMASFound);

  let totalMASCrossFound = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      if (isCenterOfMASCross(input, coordinate)) {
        totalMASCrossFound++;
      }
    }
  }

  // 1952
  console.log('total X-MAS found is ' + totalMASCrossFound);
}
