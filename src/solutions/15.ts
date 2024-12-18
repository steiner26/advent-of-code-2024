import { createCopyOfTable } from '../utils/arrayUtils';
import { Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

const convertMoveToDirection = (move: string) => {
  switch (move) {
    case '>':
      return Direction.RIGHT;
    case '^':
      return Direction.UP;
    case '<':
      return Direction.LEFT;
    case 'v':
      return Direction.DOWN;
    default:
      throw new Error('invalid move string!');
  }
};

const processMoves = (warehouseMap: string[][], moves: Direction[]) => {
  const robotY = warehouseMap.findIndex(row => row.includes('@'));
  const robotX = warehouseMap[robotY].indexOf('@');
  let robotCoordinate = new Coordinate(robotX, robotY);
  let updatedWarehouseMap = createCopyOfTable(warehouseMap);
  for (const move of moves) {
    const targetCoordinate = robotCoordinate.add(move);
    const targetTile =
      updatedWarehouseMap[targetCoordinate.y][targetCoordinate.x];
    if (targetTile === '.') {
      updatedWarehouseMap[targetCoordinate.y][targetCoordinate.x] = '@';
      updatedWarehouseMap[robotCoordinate.y][robotCoordinate.x] = '.';
      robotCoordinate = targetCoordinate;
    } else if (targetTile === 'O') {
      let followingCoordinate = targetCoordinate.add(move);
      let followingTile =
        updatedWarehouseMap[followingCoordinate.y][followingCoordinate.x];
      while (followingTile === 'O') {
        followingCoordinate = followingCoordinate.add(move);
        followingTile =
          updatedWarehouseMap[followingCoordinate.y][followingCoordinate.x];
      }
      if (followingTile === '.') {
        updatedWarehouseMap[followingCoordinate.y][followingCoordinate.x] = 'O';
        updatedWarehouseMap[targetCoordinate.y][targetCoordinate.x] = '@';
        updatedWarehouseMap[robotCoordinate.y][robotCoordinate.x] = '.';
        robotCoordinate = targetCoordinate;
      }
    }
  }
  return updatedWarehouseMap;
};

const calculateSumOfGPSCoordinates = (warehouseMap: string[][]) => {
  let sum = 0;
  for (let y = 0; y < warehouseMap.length; y++) {
    for (let x = 0; x < warehouseMap[0].length; x++) {
      if (warehouseMap[y][x] === 'O') {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
};

export default async function solution() {
  const input = await readLines('/data/15.txt');
  const sectionDividerIndex = input.indexOf('');

  const warehouseMapInput = input.slice(0, sectionDividerIndex);
  const warehouseMap = warehouseMapInput.map(row => row.split(''));

  const movesInput = input.slice(sectionDividerIndex + 1).join('');
  const moves = movesInput.split('').map(convertMoveToDirection);

  const finalWarehouseMap = processMoves(warehouseMap, moves);
  const sumOfGPSCoordinates = calculateSumOfGPSCoordinates(finalWarehouseMap);
  // 1511865
  console.log(sumOfGPSCoordinates);
}
