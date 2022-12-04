const fs =  require('fs');

const fileContents = fs.readFileSync("cleaning-assignments.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

// Util to parse lines
function getElves(line) {
    const ranges = line.split(',');
    const firstElf = ranges[0].split('-').map(v => Number(v));
    const secondElf = ranges[1].split('-').map(v => Number(v));

    return [firstElf, secondElf];
}

// Part 1
function isFullyContained(a, b) {
    return b[0] <= a[0] && a[0] <= b[1] && b[0] <= a[1] && a[1] <= b[1];
}

let fullOverlap = 0;
for (var line of fileByLine) {
    const [firstElf, secondElf] = getElves(line);

    if (isFullyContained(firstElf, secondElf) || isFullyContained(secondElf, firstElf)) {
        fullOverlap++;
    }
}

console.log(`Fully overlapping assignments ${fullOverlap}`);

// Part 2
function isOverlapping(a, b) {
    return (b[0] <= a[0] && a[0] <= b[1]) || (b[0] <= a[1] && a[1] <= b[1]);
}

let partialOverlap = 0;
for (var line of fileByLine) {
    const [firstElf, secondElf] = getElves(line);

    if (isOverlapping(firstElf, secondElf) || isOverlapping(secondElf, firstElf)) {
        partialOverlap++;
    }
}

console.log(`Fully overlapping assignments ${partialOverlap}`);