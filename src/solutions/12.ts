import { getCharacterAtCoordinate } from '../utils/arrayUtils';
import { Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

type Region = {
  type: string;
  plots: Coordinate[];
  size: number;
  perimeter: number;
};

const getRegions = (input: string[]): Region[] => {
  const regions: Region[] = [];
  const visited = new Set<string>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      const type = getCharacterAtCoordinate(input, coordinate);
      if (visited.has(coordinate.toString()) || !type) {
        continue;
      }
      visited.add(coordinate.toString());

      let size = 1;
      let perimeter = 0;
      const plots: Coordinate[] = [];
      const plotsToProcess = [coordinate];

      while (plotsToProcess.length > 0) {
        const plot = plotsToProcess.pop();
        if (!plot) {
          break;
        }
        plots.push(plot);
        for (const direction of [
          Direction.RIGHT,
          Direction.UP,
          Direction.LEFT,
          Direction.DOWN,
        ]) {
          const neighboringPlot = plot.add(direction);
          const neighboringType = getCharacterAtCoordinate(
            input,
            neighboringPlot,
          );
          if (neighboringType !== type) {
            perimeter += 1;
          } else if (!visited.has(neighboringPlot.toString())) {
            plotsToProcess.push(neighboringPlot);
            visited.add(neighboringPlot.toString());
            size += 1;
          }
        }
      }
      regions.push({
        type,
        plots,
        size,
        perimeter,
      });
    }
  }
  return regions;
};

const getPriceOfFencingRegions = (input: string[]) => {
  const regions = getRegions(input);
  const totalPrice = regions.reduce(
    (accm, region) => accm + region.perimeter * region.size,
    0,
  );

  return totalPrice;
};

const getNumberOfSides = (input: string[], region: Region) => {
  // sort plots from top left to bottom right
  const plots = [...region.plots].sort(
    (plotA, plotB) =>
      plotA.y * input.length + plotA.x - (plotB.y * input.length + plotB.x),
  );

  let sides = 0;
  for (const plot of plots) {
    const RIGHT = plot.add(Direction.RIGHT);
    const UP_RIGHT = plot.add(Direction.UP_RIGHT);
    const UP = plot.add(Direction.UP);
    const LEFT = plot.add(Direction.LEFT);
    const DOWN_LEFT = plot.add(Direction.DOWN_LEFT);
    const DOWN = plot.add(Direction.DOWN);
    const DOWN_RIGHT = plot.add(Direction.DOWN_RIGHT);

    if (
      !plots.some(p => p.equals(UP)) &&
      (!plots.some(p => p.equals(RIGHT)) || plots.some(p => p.equals(UP_RIGHT)))
    ) {
      sides += 1;
    }

    if (
      !plots.some(p => p.equals(DOWN)) &&
      (!plots.some(p => p.equals(RIGHT)) ||
        plots.some(p => p.equals(DOWN_RIGHT)))
    ) {
      sides += 1;
    }

    if (
      !plots.some(p => p.equals(LEFT)) &&
      (!plots.some(p => p.equals(DOWN)) || plots.some(p => p.equals(DOWN_LEFT)))
    ) {
      sides += 1;
    }

    if (
      !plots.some(p => p.equals(RIGHT)) &&
      (!plots.some(p => p.equals(DOWN)) ||
        plots.some(p => p.equals(DOWN_RIGHT)))
    ) {
      sides += 1;
    }
  }

  return sides;
};

const getPriceOfFencingRegionsWithBulkDiscount = (input: string[]) => {
  const regions = getRegions(input);
  const regionsWithSides = regions.map(region => ({
    ...region,
    sides: getNumberOfSides(input, region),
  }));

  return regionsWithSides.reduce(
    (accm, region) => accm + region.size * region.sides,
    0,
  );
};

export default async function solution() {
  const input = await readLines('/data/12.txt');
  const totalPrice = getPriceOfFencingRegions(input);
  // 1446042
  console.log('the total fencing cost is ' + totalPrice);

  const totalPriceWithBulkDiscount =
    getPriceOfFencingRegionsWithBulkDiscount(input);
  // 902742
  console.log(
    'the total fencing cost with bulk discounts is ' +
      totalPriceWithBulkDiscount,
  );
}
