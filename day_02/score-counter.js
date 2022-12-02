const fs = require('fs');

const strategyRaw = fs.readFileSync('strategy-guide.txt').toString('utf-8');
const strategyLines = strategyRaw.split(/\r?\n/);

// Maps to reason around moves
const scoreMap = {
    'X': 1,
    'Y': 2,
    'Z': 3
}

const winMap = {
    "A": "Z",
    "B": "X",
    "C": "Y"
}

const drawMap = {
    "A": "X",
    "B": "Y",
    "C": "Z"
}

// Iterate and sum using strategy for first task
var score = 0;
strategyLines.forEach(x => {
    const moves = x.split(' ');
    
    const isWin = !(winMap[moves[0]] === moves[1]);
    const isDraw = (drawMap[moves[0]] === moves[1]);
    var roundScore = scoreMap[moves[1]];

    if (isDraw) {
        roundScore += 3;
    }
    else if (isWin) {
        roundScore += 6;
    }
    else {
        // Nuthin!
    }

    score += roundScore;
});

console.log(`Sum is ${score}`);

// New maps for new reasoning
const moveToLose = {
    "A": "C",
    "B": "A",
    "C": "B"
};

const moveToWin = {
    "A": "B",
    "B": "C",
    "C": "A"
}

const newScoreMap = {
    "A": 1,
    "B": 2,
    "C": 3
}

const moveName = {
    "A": "Rock",
    "B": "Paper",
    "C": "Scissors"
}

// Determine move and calculate score
var newStratScore = 0;
strategyLines.forEach(x => {
    const moves = x.split(' '); 
    var myMove = moves[0]; // Default target draw
    var roundScore = 0;

    if (moves[1] === 'X') {
        myMove = moveToLose[moves[0]];
        roundScore = newScoreMap[myMove];
    }
    else if (moves[1] === 'Y') {
        roundScore = 3 + newScoreMap[myMove];
    }
    else if (moves[1] === 'Z') {
        myMove = moveToWin[moves[0]];
        roundScore = 6 + newScoreMap[myMove];
    }

    newStratScore += roundScore;
});

console.log(`Sum is ${newStratScore}`);