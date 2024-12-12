import { getCharacterAtCoordinate } from '../utils/arrayUtils';
import { Coordinate, Direction } from '../utils/coordinate';
import { readLines } from '../utils/io';

const getPriceOfFencingRegions = (input: string[]) => {
  let totalPrice = 0;
  const visited = new Set<string>();
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const coordinate = new Coordinate(x, y);
      if (visited.has(coordinate.toString())) {
        continue;
      }
      visited.add(coordinate.toString());

      const type = getCharacterAtCoordinate(input, coordinate);
      let size = 1;
      let perimeter = 0;
      const plotsToProcess = [coordinate];
      while (plotsToProcess.length > 0) {
        const plot = plotsToProcess.pop();
        if (!plot) {
          break;
        }
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
      totalPrice += size * perimeter;
    }
  }
  return totalPrice;
};

export default async function solution() {
  const input = await readLines('/data/12.txt');
  const totalPrice = getPriceOfFencingRegions(input);
  // 1446042
  console.log(totalPrice);
}
