import { Angle, Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

const getCoordinateOfCharacter = (input: string[], character: string) => {
  const y = input.findIndex((row) => row.includes(character))
  const x = input[y].indexOf(character)

  return new Coordinate(x, y)
}

const getCharacterAtCoordinate = (input: string[], coordinate: Coordinate) => {
  if (coordinate.x < 0 || coordinate.x >= input[0].length) {
    return null;
  }

  if (coordinate.y < 0 || coordinate.y >= input.length) {
    return null;
  }

  return input[coordinate.y].charAt(coordinate.x);
};

export default async function solution() {
  const input = await readLines('/data/06.txt');

  let direction = Direction.UP
  let coordinate = getCoordinateOfCharacter(input, "^")
  let nextCoordinate = coordinate.add(direction)
  let nextCharacter = getCharacterAtCoordinate(input, nextCoordinate)
  const visited = new Set([coordinate.toString()]);

  while (nextCharacter) {
    if (nextCharacter === "#") {
      direction = direction.rotate(Angle.DEGREES_270)
    } else {
      coordinate = coordinate.add(direction);
      visited.add(coordinate.toString())
    }
    nextCoordinate = coordinate.add(direction)
    nextCharacter = getCharacterAtCoordinate(input, nextCoordinate)
  }

  // 5312
  console.log('guard will visit ' + visited.size + ' total positions')

  // keep track of the full path, including which direction you were going at each coordinate
  // while going through, if forcing the guard to turn right would put it somewhere it already was, that creates a loop
}
