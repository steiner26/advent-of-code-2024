import { createArrayWithValue } from '../utils/arrayUtils';
import { Coordinate } from '../utils/coordinate';
import { readLines } from '../utils/io';

type Robot = {
  position: Coordinate;
  velocity: Coordinate;
};

const parseCoordinate = (input: string) => {
  const [_, coordinateString] = input.split('=');
  const [xString, yString] = coordinateString.split(',');
  return new Coordinate(Number(xString), Number(yString));
};

const parseRobot = (line: string) => {
  const [positionString, velocityString] = line.split(' ');
  const position = parseCoordinate(positionString);
  const velocity = parseCoordinate(velocityString);
  return {
    position,
    velocity,
  };
};

const handleTeleport = (position: Coordinate, maxX: number, maxY: number) => {
  const x =
    position.x < 0
      ? position.x + maxX + 1
      : position.x > maxX
        ? position.x - maxX - 1
        : position.x;

  const y =
    position.y < 0
      ? position.y + maxY + 1
      : position.y > maxY
        ? position.y - maxY - 1
        : position.y;

  return new Coordinate(x, y);
};

const stepRobots = (
  robots: Robot[],
  times: number,
  maxX: number,
  maxY: number,
) => {
  let newRobots = robots.map(robot => ({ ...robot }));
  while (times > 0) {
    newRobots = newRobots.map(robot => {
      const nextPosition = robot.position.add(robot.velocity);
      return {
        position: handleTeleport(nextPosition, maxX, maxY),
        velocity: robot.velocity,
      };
    });
    times -= 1;
  }
  return newRobots;
};

const calculateSafetyFactor = (robots: Robot[], maxX: number, maxY: number) => {
  const midX = maxX / 2;
  const midY = maxY / 2;
  let topLeftCount = 0;
  let topRightCount = 0;
  let bottomLeftCount = 0;
  let bottomRightCount = 0;
  for (const robot of robots) {
    if (robot.position.x < midX && robot.position.y < midY) {
      topLeftCount += 1;
    }
    if (robot.position.x > midX && robot.position.y < midY) {
      topRightCount += 1;
    }
    if (robot.position.x < midX && robot.position.y > midY) {
      bottomLeftCount += 1;
    }
    if (robot.position.x > midX && robot.position.y > midY) {
      bottomRightCount += 1;
    }
  }

  return topLeftCount * topRightCount * bottomLeftCount * bottomRightCount;
};

const putRobotsOnMap = (robots: Robot[], maxX: number, maxY: number) => {
  const result = createArrayWithValue(maxX + 1, maxY + 1, () => '.');
  for (const robot of robots) {
    result[robot.position.y][robot.position.x] = 'X';
  }
  return result;
};

const findChristmasTree = (robots: Robot[], maxX: number, maxY: number) => {
  let newRobots = robots.map(robot => ({ ...robot }));
  let proceed = true;
  let i = 0;
  let allTimeMaxLength = 0;
  while (proceed) {
    i++;
    newRobots = newRobots.map(robot => {
      const nextPosition = robot.position.add(robot.velocity);
      return {
        position: handleTeleport(nextPosition, maxX, maxY),
        velocity: robot.velocity,
      };
    });
    const map = putRobotsOnMap(newRobots, maxX, maxY);
    const outputString = map.map(row => row.join('')).join('\n');
    const matches = outputString.matchAll(/X+/g);
    const maxLength = Math.max(...[...matches].map(match => match[0].length));
    if (maxLength >= allTimeMaxLength) {
      allTimeMaxLength = maxLength;
    }
    if (maxLength > 20) {
      console.log(outputString);
      return i;
    }
  }
};

export default async function solution() {
  const input = await readLines('/data/14.txt');
  const robots = input.map(line => parseRobot(line));
  const maxX = Math.max(...robots.map(({ position }) => position.x));
  const maxY = Math.max(...robots.map(({ position }) => position.y));

  const finalRobots = stepRobots(robots, 100, maxX, maxY);
  const safetyFactor = calculateSafetyFactor(finalRobots, maxX, maxY);
  // 225810288
  console.log('the safety factor after 100 seconds is ' + safetyFactor);

  const christmasTreeSeconds = findChristmasTree(robots, maxX, maxY);
  // 6752
  console.log(
    'The easter egg occurs after ' + christmasTreeSeconds + ' seconds',
  );
}
