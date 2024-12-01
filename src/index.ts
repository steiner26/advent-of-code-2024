import * as readline from 'readline';
import { readDirectory } from './utils/io';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getLatestQuestion = async () => {
  const directoryContents = await readDirectory('/src/solutions');
  const questions = directoryContents.map(file => file.slice(0, 2));
  questions.sort();
  return questions[questions.length - 1];
};

const getQuestionNumber = async () => {
  const questionNumber = process.argv[2];
  if (!questionNumber) {
    return await getLatestQuestion();
  }
  return questionNumber.length === 1 ? `0${questionNumber}` : questionNumber;
};

const main = async () => {
  const questionNumber = await getQuestionNumber();

  const questionSolution = await import(`./solutions/${questionNumber}`);
  console.log(`running question ${questionNumber}`);
  questionSolution.default();

  // Close the readline interface
  rl.close();
};

main();
