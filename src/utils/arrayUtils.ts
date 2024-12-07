import { Coordinate } from './coordinate';

export const getFirstCoordinateOfCharacter = (
  input: string[],
  character: string,
) => {
  const y = input.findIndex(row => row.includes(character));
  const x = input[y].indexOf(character);

  return new Coordinate(x, y);
};

export const getCharacterAtCoordinate = (
  input: string[],
  coordinate: Coordinate,
) => {
  if (coordinate.x < 0 || coordinate.x >= input[0].length) {
    return null;
  }

  if (coordinate.y < 0 || coordinate.y >= input.length) {
    return null;
  }

  return input[coordinate.y].charAt(coordinate.x);
};

export const createCopyWithValue = <T>(
  input: string[],
  valueFactory: () => T,
) => {
  return new Array(input.length)
    .fill(null)
    .map(_ => new Array(input[0].length).fill(null).map(valueFactory));
};
