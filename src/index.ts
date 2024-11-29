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
  return new Promise(resolve => {
    rl.question(
      'What question should be run? Leave blank for the most recent\n',
      async answer => {
        if (!answer) {
          resolve(await getLatestQuestion());
        }
        resolve(answer.length === 1 ? `0${answer}` : answer);
      },
    );
  });
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
