const fs = require('fs');

const fileContents = fs.readFileSync("crate-moves.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

const startPositions = fileByLine.slice(0, 8);

// Utilities to load and print data
function c(value) {
    return (value) ? `[${value}]` : '   ';
}

function printStacks(allStacks) {
    const maxLen = Math.max(...allStacks.map(s => s.length))
    for (let i = 0; i < maxLen; i++) {
        const currentIndex = maxLen-i-1;
        console.log(allStacks.map(s => c(s[currentIndex])).join(' '));
    }
    console.log();
}

function prepStacks(lines) {
    let stacks = [[],[],[],[],[],[],[],[],[]];
    let stackIndex = 0;
    for (let line of startPositions) {
        for(let i = 1; i < line.length; i += 4) {
            stacks[stackIndex++].push(line.charAt(i));
        }
        stackIndex = 0;
    }

    return stacks.map(l => l.filter(v => v.trim())).map(l => l.reverse());
}

// Prep move list
const moveList = fileByLine.slice(10, fileByLine.length);

let stacks = prepStacks(fileByLine);
printStacks(stacks);

// Task 1, normal stack moves
for (let move of moveList) {
    const tokenized = move.split(' ');
    let remainingMoves = Number(tokenized[1]);
    const from = Number(tokenized[3])-1;
    const to = Number(tokenized[5])-1;

    while (remainingMoves--) {
        stacks[to].push(stacks[from].pop());
    }
}

printStacks(stacks);

// Task 2, move crates in chunks
stacks = prepStacks(fileByLine);
for (let move of moveList) {
    const tokenized = move.split(' ');
    let moves = Number(tokenized[1]);
    const from = Number(tokenized[3])-1;
    const to = Number(tokenized[5])-1;

    
    stacks[to].push(...stacks[from].splice(stacks[from].length-moves, Infinity));
}

printStacks(stacks);