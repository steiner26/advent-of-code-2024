import { readLines } from '../utils/io';

const calculateTotalDistance = (leftList: number[], rightList: number[]) => {
  leftList.sort();
  rightList.sort();

  const distance = leftList.reduce((accm, leftNum, i) => {
    return accm + Math.abs(leftNum - rightList[i]);
  }, 0);

  return distance;
};

const calculateSimilarityScore = (leftList: number[], rightList: number[]) => {
  leftList.sort();
  rightList.sort();

  const similarityScore = leftList.reduce((accm, leftNum) => {
    if (rightList.includes(leftNum)) {
      return (
        accm +
        leftNum *
          (rightList.lastIndexOf(leftNum) - rightList.indexOf(leftNum) + 1)
      );
    }
    return accm;
  }, 0);

  return similarityScore;
};

export default async function solution() {
  const lines = await readLines('/data/01.txt');

  const leftList: number[] = [];
  const rightList: number[] = [];
  lines.forEach(line => {
    const nums = line.split('   ');
    leftList.push(Number(nums[0]));
    rightList.push(Number(nums[1]));
  });

  const totalDistance = calculateTotalDistance(leftList, rightList);
  // 1882714
  console.log('total distance is ' + totalDistance);

  const similarityScore = calculateSimilarityScore(leftList, rightList);
  // 19437052
  console.log('similarity score is ' + similarityScore);
}
