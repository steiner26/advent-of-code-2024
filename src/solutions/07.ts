import { readLines } from '../utils/io';

enum Operator {
  ADD = '+',
  MULTIPLY = '*',
  CONCATENATE = '||',
}

type Equation = {
  total: number;
  operands: number[];
};

type EquationWithOperators = Equation & {
  operators: Operator[] | null;
};

const parseEquation = (line: string) => {
  const [totalString, operandsString] = line.split(': ');
  return {
    total: Number(totalString),
    operands: operandsString.split(' ').map(op => Number(op)),
  };
};

const concatenate = (operand1: number, operand2: number) => {
  return Number(String(operand1) + String(operand2));
};

const findOperators = (
  { total, operands }: Equation,
  runningTotal: number | null,
  operators: Operator[],
): Operator[] | null => {
  if (runningTotal === null) {
    return findOperators(
      { total, operands: operands.slice(1, operands.length) },
      operands[0],
      operators,
    );
  }

  if (operands.length === 0) {
    return total === runningTotal ? operators : null;
  }

  const potentialOperatorsWithAdd = findOperators(
    {
      total,
      operands: operands.slice(1),
    },
    runningTotal + operands[0],
    [...operators, Operator.ADD],
  );

  const potentialOperatorsWithMultiply = findOperators(
    {
      total,
      operands: operands.slice(1),
    },
    runningTotal * operands[0],
    [...operators, Operator.MULTIPLY],
  );

  return potentialOperatorsWithAdd ?? potentialOperatorsWithMultiply ?? null;
};

const findOperatorsIncludingConcatenate = (
  { total, operands }: Equation,
  runningTotal: number | null,
  operators: Operator[],
): Operator[] | null => {
  if (runningTotal === null) {
    return findOperatorsIncludingConcatenate(
      { total, operands: operands.slice(1, operands.length) },
      operands[0],
      operators,
    );
  }

  if (operands.length === 0) {
    return total === runningTotal ? operators : null;
  }

  const potentialOperatorsWithAdd = findOperatorsIncludingConcatenate(
    {
      total,
      operands: operands.slice(1),
    },
    runningTotal + operands[0],
    [...operators, Operator.ADD],
  );

  const potentialOperatorsWithMultiply = findOperatorsIncludingConcatenate(
    {
      total,
      operands: operands.slice(1),
    },
    runningTotal * operands[0],
    [...operators, Operator.MULTIPLY],
  );

  const potentialOperatorsWithConcatenate = findOperatorsIncludingConcatenate(
    {
      total,
      operands: operands.slice(1),
    },
    concatenate(runningTotal, operands[0]),
    [...operators, Operator.CONCATENATE],
  );

  return (
    potentialOperatorsWithAdd ??
    potentialOperatorsWithMultiply ??
    potentialOperatorsWithConcatenate ??
    null
  );
};

export default async function solution() {
  const input = await readLines('/data/07.txt');
  const equations = input.map(parseEquation);
  const equationsWithOperators: EquationWithOperators[] = equations.map(
    equation => ({
      ...equation,
      operators: findOperators(equation, null, []),
    }),
  );

  const totalOfValidEquations = equationsWithOperators
    .filter(({ operators }) => Boolean(operators))
    .reduce((accm, { total }) => accm + total, 0);
  // 2299996598890
  console.log('total calibration result is ' + totalOfValidEquations);

  const equationsWithOperatorsIncludingConcatenate: EquationWithOperators[] =
    equations.map(equation => ({
      ...equation,
      operators: findOperatorsIncludingConcatenate(equation, null, []),
    }));

  const totalOfValidEquationsIncludingConcatenate =
    equationsWithOperatorsIncludingConcatenate
      .filter(({ operators }) => Boolean(operators))
      .reduce((accm, { total }) => accm + total, 0);
  // 362646859298554
  console.log(
    'total calibration result with concatenate is ' +
      totalOfValidEquationsIncludingConcatenate,
  );
}
