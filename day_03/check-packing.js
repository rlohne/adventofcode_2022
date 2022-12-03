const fs = require('fs');

const fileContents = fs.readFileSync("package-list.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

// Useful things
const priorities = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function array_to_chunks(data, size){
    let chunks = []
    let d = data.slice()
    while (d.length >= size) chunks.push(d.splice(0, size))
    return chunks
 }

 // Task 1
var fullSum = 0;
fileByLine.forEach(line => {

    var compartmentOne = new Set();
    var compartmentTwo = new Set();
    for(var i = 0; i < line.length/2; i++) {
        compartmentOne.add(line[i]);
        compartmentTwo.add(line[line.length-1-i]);
    }

    var shared = new Set();
    compartmentOne.forEach(s => {
        if(compartmentTwo.has(s)) {
            shared.add(s);
        }
    });

    var lineSum = 0;
    shared.forEach(v => lineSum += priorities.indexOf(v));

    fullSum += lineSum;
});

console.log(`Sum of priorities ${fullSum}`);

// Task 2
const sacksGrouped = array_to_chunks(fileByLine, 3);
const groupNames = sacksGrouped.map(group => {
    let match;
    for(let c of group[0]) {
        if (group[1].includes(c) && group[2].includes(c)) {
            match = c;
            break;
        }
    };

    return match;
});
const groupSum = groupNames.reduce((c, v) => c += priorities.indexOf(v), 0);
console.log(`Priorities by group name ${groupSum}`);