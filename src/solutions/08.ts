import {
  createCopyWithValue,
  getCharacterAtCoordinate,
  isInBounds,
} from '../utils/arrayUtils';
import { Coordinate } from '../utils/coordinate';
import { readLines } from '../utils/io';

type AntennaSummary = {
  [frequency: string]: Coordinate[];
};

type AntinodeSummary = {
  frequency: string;
  antenna1: Coordinate;
  antenna2: Coordinate;
};

const getAntennaSummary = (input: string[]) => {
  const antennaSummary: AntennaSummary = {};
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      const frequency = getCharacterAtCoordinate(input, coordinate);
      if (frequency && frequency !== '.') {
        antennaSummary[frequency] = [
          ...(antennaSummary[frequency] ?? []),
          coordinate,
        ];
      }
    }
  }
  return antennaSummary;
};

function fillOutAntinodeMap(input: string[], antennaSummary: AntennaSummary) {
  const antinodeMap = createCopyWithValue(input, () => [] as AntinodeSummary[]);
  for (const frequency of Object.keys(antennaSummary)) {
    const antennas = antennaSummary[frequency];
    for (let i = 0; i < antennas.length; i++) {
      const antenna1 = antennas[i];
      for (let j = i + 1; j < antennas.length; j++) {
        const antenna2 = antennas[j];
        const difference = antenna2.subtract(antenna1);

        const antinode1 = antenna1.subtract(difference);

        if (isInBounds(input, antinode1)) {
          antinodeMap[antinode1.y][antinode1.x].push({
            frequency,
            antenna1,
            antenna2,
          });
        }
        const antinode2 = antenna2.add(difference);
        if (isInBounds(input, antinode2)) {
          antinodeMap[antinode2.y][antinode2.x].push({
            frequency,
            antenna1,
            antenna2,
          });
        }
      }
    }
  }
  return antinodeMap;
}

function fillOutAdvancedAntinodeMap(
  input: string[],
  antennaSummary: AntennaSummary,
) {
  const antinodeMap = createCopyWithValue(input, () => [] as AntinodeSummary[]);
  for (const frequency of Object.keys(antennaSummary)) {
    const antennas = antennaSummary[frequency];
    for (let i = 0; i < antennas.length; i++) {
      const antenna1 = antennas[i];
      for (let j = i + 1; j < antennas.length; j++) {
        const antenna2 = antennas[j];
        const direction = antenna2.subtract(antenna1).reduce();

        let antinodeCoord = antenna2;
        while (isInBounds(input, antinodeCoord)) {
          antinodeMap[antinodeCoord.y][antinodeCoord.x].push({
            frequency,
            antenna1,
            antenna2,
          });
          antinodeCoord = antinodeCoord.add(direction);
        }
        antinodeCoord = antenna2;
        while (isInBounds(input, antinodeCoord)) {
          antinodeMap[antinodeCoord.y][antinodeCoord.x].push({
            frequency,
            antenna1,
            antenna2,
          });
          antinodeCoord = antinodeCoord.subtract(direction);
        }
      }
    }
  }
  return antinodeMap;
}

export default async function solution() {
  const input = await readLines('/data/08.txt');
  const antennaSummary = getAntennaSummary(input);
  // console.log(antennaSummary);

  const antinodeMap = fillOutAntinodeMap(input, antennaSummary);
  const numLocationsWithAntinodes = antinodeMap.reduce(
    (accm1, row) =>
      accm1 + row.reduce((accm2, cell) => accm2 + (cell.length > 0 ? 1 : 0), 0),
    0,
  );
  // 289
  console.log(
    'the number of locations with antinodes is ' + numLocationsWithAntinodes,
  );

  const advancedAntinodeMap = fillOutAdvancedAntinodeMap(input, antennaSummary);
  const numLocationsWithAdvancedAntinodes = advancedAntinodeMap.reduce(
    (accm1, row) =>
      accm1 + row.reduce((accm2, cell) => accm2 + (cell.length > 0 ? 1 : 0), 0),
    0,
  );
  //1030
  console.log(
    'the number of locations with advanced antinodes is ' +
      numLocationsWithAdvancedAntinodes,
  );
}
