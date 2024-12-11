import { readLines } from '../utils/io';

interface File {
  id: number;
  start: number;
  size: number;
  remaining: number;
}

interface FreeSpace {
  start: number;
  size: number;
  remaining: number;
}

interface DiskMap {
  files: File[];
  freeSpaces: FreeSpace[];
}

const parseDiskMap = (input: string) => {
  const files: File[] = [];
  const freeSpaces: FreeSpace[] = [];
  let diskLocation = 0;
  for (let i = 0; i < input.length; i++) {
    const value = Number(input.charAt(i));
    if (i % 2 === 0) {
      files.push({
        id: i / 2,
        start: diskLocation,
        size: value,
        remaining: value,
      });
    } else {
      freeSpaces.push({
        start: diskLocation,
        size: value,
        remaining: value,
      });
    }
    diskLocation += value;
  }
  return {
    files,
    freeSpaces,
  };
};

const calculateChecksum = async ({ files, freeSpaces }: DiskMap) => {
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

const compactDiskMapAndCalculateCheckSum = ({ files, freeSpaces }: DiskMap) => {
  const newFiles = [];
  const newFreeSpaces = [...freeSpaces];
  for (let id = files.length - 1; id >= 0; id--) {
    const file = files.find(f => f.id === id);
    if (!file) {
      continue;
    }
    const freeSpaceIndex = newFreeSpaces.findIndex(
      fs => fs.size >= file.size && fs.start < file.start,
    );
    if (freeSpaceIndex < 0) {
      newFiles.push(file);
      continue;
    }
    const freeSpace = newFreeSpaces[freeSpaceIndex];
    newFiles.push({
      id: file.id,
      start: freeSpace.start,
      size: file.size,
      remaining: file.remaining,
    });
    const freeSpaceBeforeIndex = newFreeSpaces.findIndex(
      fs => fs.start + fs.size === file.start,
    );
    const freeSpaceBefore = newFreeSpaces[freeSpaceBeforeIndex];
    const freeSpaceAfter = newFreeSpaces[freeSpaceBeforeIndex + 1];
    newFreeSpaces.splice(freeSpaceBeforeIndex, 2, {
      start: freeSpaceBefore?.start ?? file.start,
      size:
        (freeSpaceBefore?.size ?? 0) + file.size + (freeSpaceAfter?.size ?? 0),
      remaining:
        (freeSpaceBefore?.size ?? 0) + file.size + (freeSpaceAfter?.size ?? 0),
    });
    newFreeSpaces.splice(
      freeSpaceIndex,
      1,
      {
        start: freeSpace.start,
        size: 0,
        remaining: 0,
      },
      {
        start: freeSpace.start + file.size,
        size: freeSpace.size - file.size,
        remaining: freeSpace.size - file.size,
      },
    );
  }
  let checksum = 0;
  for (const file of newFiles) {
    while (file.remaining > 0) {
      checksum += file.id * (file.start + file.remaining - 1);
      file.remaining -= 1;
    }
  }
  return checksum;
};

export default async function solution() {
  const [input] = await readLines('/data/09.txt');
  const diskMap = parseDiskMap(input);

  const checksum = await calculateChecksum(diskMap);

  // 6353658451014
  console.log('part 1 checksum is ' + checksum);

  const diskMap2 = parseDiskMap(input);
  const compactedDiskMapChecksum = compactDiskMapAndCalculateCheckSum(diskMap2);

  // 6382582136592
  console.log('part 2 checksum is ' + compactedDiskMapChecksum);
}
