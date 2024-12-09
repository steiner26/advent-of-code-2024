import { readLines } from '../utils/io';

interface File {
  id: number;
  size: number;
  remaining: number;
}

interface FreeSpace {
  size: number;
  remaining: number;
}

const parseDiskMap = (input: string) => {
  const files: File[] = [];
  const freeSpaces: FreeSpace[] = [];
  for (let i = 0; i < input.length; i++) {
    if (i % 2 === 0) {
      files.push({
        id: i / 2,
        size: Number(input.charAt(i)),
        remaining: Number(input.charAt(i)),
      });
    } else {
      freeSpaces.push({
        size: Number(input.charAt(i)),
        remaining: Number(input.charAt(i)),
      });
    }
  }
  return {
    files,
    freeSpaces,
  };
};

const calculateChecksum = async ({
  files,
  freeSpaces,
}: {
  files: File[];
  freeSpaces: FreeSpace[];
}) => {
  let checksum = 0;
  let position = 0;

  let forwardFilesIndex = 0;
  let backwardFilesIndex = files.length - 1;
  let freeSpacesIndex = 0;

  while (forwardFilesIndex <= backwardFilesIndex) {
    if (forwardFilesIndex === freeSpacesIndex) {
      if (files[forwardFilesIndex].remaining === 0) {
        forwardFilesIndex += 1;
        continue;
      }
      console.log(position, files[forwardFilesIndex]);
      checksum += files[forwardFilesIndex].id * position;
      files[forwardFilesIndex].remaining -= 1;
      if (files[forwardFilesIndex].remaining === 0) {
        forwardFilesIndex += 1;
      }
    } else {
      if (freeSpaces[freeSpacesIndex].remaining === 0) {
        freeSpacesIndex += 1;
        continue;
      }
      while (files[backwardFilesIndex].remaining === 0) {
        backwardFilesIndex -= 1;
      }
      console.log(position, files[backwardFilesIndex]);
      checksum += files[backwardFilesIndex].id * position;
      files[backwardFilesIndex].remaining -= 1;
      if (files[backwardFilesIndex].remaining === 0) {
        backwardFilesIndex -= 1;
      }
      freeSpaces[freeSpacesIndex].remaining -= 1;
      if (freeSpaces[freeSpacesIndex].remaining === 0) {
        freeSpacesIndex += 1;
      }
    }
    position += 1;
  }
  return checksum;
};

export default async function solution() {
  const [input] = await readLines('/data/09.txt');
  const diskMap = parseDiskMap(input);

  const checksum = await calculateChecksum(diskMap);

  // 6353658451014
  console.log(checksum);
}
