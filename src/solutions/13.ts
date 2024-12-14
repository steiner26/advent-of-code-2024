import { Coordinate } from '../utils/coordinate';
import { readLines } from '../utils/io';

type Machine = {
  A: Coordinate;
  B: Coordinate;
  prize: Coordinate;
};

type MachineSolutiuon = Machine &
  (
    | {
        aPresses: number;
        bPresses: number;
      }
    | {
        aPresses: null;
        bPresses: null;
      }
  );

const parseMachines = (input: string[]): Machine[] => {
  const machines: Machine[] = [];
  let machineInProgress: any = {};
  for (let i = 0; i < input.length; i++) {
    switch (i % 4) {
      case 0:
        const [A, aCoordString] = input[i].split(': ');
        const [axString, ayString] = aCoordString.split(', ');
        machineInProgress.A = new Coordinate(
          Number(axString.split('+')[1]),
          Number(ayString.split('+')[1]),
        );
        break;
      case 1:
        const [B, bCoordString] = input[i].split(': ');
        const [bxString, byString] = bCoordString.split(', ');
        machineInProgress.B = new Coordinate(
          Number(bxString.split('+')[1]),
          Number(byString.split('+')[1]),
        );
        break;
      case 2:
        const [P, pCoordString] = input[i].split(': ');
        const [pxString, pyString] = pCoordString.split(', ');
        machineInProgress.prize = new Coordinate(
          Number(pxString.split('=')[1]),
          Number(pyString.split('=')[1]),
        );
        break;
      case 3:
        machines.push(machineInProgress as Machine);
        machineInProgress = {};
        break;
    }
  }
  if (machineInProgress.prize) {
    machines.push(machineInProgress);
  }
  return machines;
};

const getMachineSolution = (machine: Machine): MachineSolutiuon => {
  const aNumerator =
    machine.B.y * machine.prize.x - machine.B.x * machine.prize.y;
  const aDenominator = machine.A.x * machine.B.y - machine.A.y * machine.B.x;
  if (aDenominator === 0) {
    console.log('0 numerator!!');
  }
  const aPresses = aNumerator / aDenominator;
  const bPresses = (machine.prize.x - machine.A.x * aPresses) / machine.B.x;
  if (Math.floor(aPresses) === aPresses && Math.floor(bPresses) === bPresses) {
    return {
      ...machine,
      aPresses,
      bPresses,
    };
  }
  return {
    ...machine,
    aPresses: null,
    bPresses: null,
  };
};

const getTokensToGetPrize = (machineSolution: MachineSolutiuon) => {
  if (!machineSolution.aPresses || !machineSolution.bPresses) {
    return 0;
  }

  return 3 * machineSolution.aPresses + machineSolution.bPresses;
};

export default async function solution() {
  const input = await readLines('/data/13.txt');
  const machines = parseMachines(input);
  const machineSolutions = machines.map(getMachineSolution);
  const totalTokens = machineSolutions.reduce(
    (accm, machine) => accm + getTokensToGetPrize(machine),
    0,
  );
  // 35255
  console.log('winning all prizes will take ' + totalTokens + ' tokens');

  const newMachines = machines.map(machine => ({
    ...machine,
    prize: machine.prize.add(new Coordinate(10000000000000, 10000000000000)),
  }));
  const newMachineSolutions = newMachines.map(getMachineSolution);
  const newTotalTokens = newMachineSolutions.reduce(
    (accm, machine) => accm + getTokensToGetPrize(machine),
    0,
  );
  // 87582154060429
  console.log(
    'winning all prizes in part 2 will take ' + newTotalTokens + ' tokens',
  );
}
