import { readLines } from '../utils/io';

const isSafe = (report: number[]) => {
  let sign = null;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i + 1] - report[i];
    if (Math.abs(diff) > 3 || diff === 0) {
      return false;
    }

    if (sign) {
      if (sign !== Math.sign(diff)) {
        return false;
      }
    } else {
      sign = Math.sign(diff);
    }
  }
  return true;
};

const isSafeWithRemoving = (report: number[]) => {
  if (isSafe(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const editedReport = [...report];
    editedReport.splice(i, 1);
    if (isSafe(editedReport)) {
      return true;
    }
  }
  return false;
};

export default async function solution() {
  const lines = await readLines('/data/02.txt');
  const reports = lines.map(line =>
    line.split(' ').map(level => Number(level)),
  );

  const safeReports = reports.filter(report => isSafe(report));

  // 220
  console.log('number of safe reports is ' + safeReports.length);

  const safeReportsWithRemoving = reports.filter(report =>
    isSafeWithRemoving(report),
  );

  // 296
  console.log(
    'number of safe reports with removing is ' + safeReportsWithRemoving.length,
  );
}
