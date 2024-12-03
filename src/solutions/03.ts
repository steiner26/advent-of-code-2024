import { readLines } from '../utils/io';

const MUL_REGEX = new RegExp(/mul\([0-9]{1,3},[0-9]{1,3}\)/, 'g');

const calculateMultiplyInstruction = (instruction: string) => {
  const [part1, part2] = instruction.split(',');
  const operand1 = part1.slice(4);
  const operand2 = part2.slice(0, part2.indexOf(')'));
  return Number(operand1) * Number(operand2);
};

const calculateSumOfMultiplyInstructions = (input: string) => {
  let sum = 0;
  const matches = input.matchAll(MUL_REGEX);
  for (const match of matches) {
    sum += calculateMultiplyInstruction(match[0]);
  }
  return sum;
};

export default async function solution() {
  const input = (await readLines('/data/03.txt')).join();

  // 189600467
  console.log('sum of multiply instructions is ' + calculateSumOfMultiplyInstructions(input));

  let sum = 0;
  let remainingInput = input;

  let doIndex = 0; // enabled at the start
  let dontIndex = 0;

  while (doIndex >= 0) {
    // take the remaining input starting at the next do()
    remainingInput = remainingInput.slice(doIndex);

    // and then calculate the sum of mul() instructions until the next don't()
    dontIndex = remainingInput.indexOf("don't()");
    const enabledInput = remainingInput.slice(0, dontIndex);
    sum += calculateSumOfMultiplyInstructions(enabledInput);

    // then find the following do() to use in the next iteration
    remainingInput = remainingInput.slice(dontIndex);
    doIndex = remainingInput.indexOf('do()');
  }

  // 107069718
  console.log('sum of multiply instructions with do() and don\'t() is ' + sum);
}
