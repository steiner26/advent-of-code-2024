import { readdir, readFile, writeFile } from 'fs';

export async function readDirectory(directoryName: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(process.cwd() + directoryName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

export async function readLines(filename: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readFile(process.cwd() + filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      const inputLines = data.split('\n');
      if (!inputLines[inputLines.length - 1]) {
        resolve(inputLines.slice(0, inputLines.length - 1));
      }
      resolve(inputLines);
    });
  });
}

export async function writeLines(
  filename: string,
  lines: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(filename, lines.join('\n'), err => {
      if (err) {
        reject(err);
      }

      resolve(void 0);
    });
  });
}
