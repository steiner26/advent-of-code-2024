import { readLines } from '../utils/io';

const getMiddlePageNumber = (update: string[]) => {
  return Number(update[Math.floor(update.length / 2)]);
};

const isCorrectlyOrdered = (
  rulesSummary: Record<string, string[]>,
  update: string[],
) => {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      if (rulesSummary[update[j]].includes(update[i])) {
        return false;
      }
    }
  }

  return true;
};

const getHowManyUpdatesComeAfter = (
  rulesSummary: Record<string, string[]>,
  update: string[],
  value: string,
) => {
  return rulesSummary[value].filter(afterValue => {
    return update.includes(afterValue);
  }).length;
};

const fixUpdate = (
  rulesSummary: Record<string, string[]>,
  update: string[],
) => {
  return update
    .map(value => ({
      value,
      rank: getHowManyUpdatesComeAfter(rulesSummary, update, value),
    }))
    .sort((val1, val2) => {
      return val1.rank - val2.rank;
    })
    .map(({ value }) => value);
};

export default async function solution() {
  const input = await readLines('/data/05.txt');
  const sectionDividerIndex = input.indexOf('');

  const rulesInput = input.slice(0, sectionDividerIndex);
  const rules = rulesInput.map(rule => ({
    before: rule.slice(0, 2),
    after: rule.slice(3),
  }));

  // map from each number to a list of all numbers it must be before
  const rulesSummary = rules.reduce((accm: Record<string, string[]>, rule) => {
    if (!accm[rule.before]) {
      accm[rule.before] = [rule.after];
    } else {
      accm[rule.before].push(rule.after);
    }
    return accm;
  }, {});

  const updatesInput = input.slice(sectionDividerIndex + 1);
  const updates = updatesInput.map(update => update.split(','));

  const sumOfMiddleNumbersFromCorrectUpdates = updates
    .filter(update => isCorrectlyOrdered(rulesSummary, update))
    .reduce((accm, update) => {
      return accm + getMiddlePageNumber(update);
    }, 0);

  // 5509
  console.log(
    'sum of middle numbers from correctly ordered updates is ' +
      sumOfMiddleNumbersFromCorrectUpdates,
  );

  const incorrectlyOrderedUpdates = updates.filter(
    update => !isCorrectlyOrdered(rulesSummary, update),
  );

  const sumOfMiddleNumbersFromFixedIncorrectUpdates = incorrectlyOrderedUpdates
    .map(update => fixUpdate(rulesSummary, update))
    .reduce((accm, update) => {
      return accm + getMiddlePageNumber(update);
    }, 0);

  // 4407
  console.log(
    'sum of middle numbers from fixed incorrectly ordered updates is ' +
      sumOfMiddleNumbersFromFixedIncorrectUpdates,
  );
}
