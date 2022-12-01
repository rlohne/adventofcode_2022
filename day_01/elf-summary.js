const fs = require("fs");

const fileContents = fs.readFileSync("calory-summary.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

const elfCalories = [];

var calories = 0;
fileByLine.forEach(v => {
    if (v) {
        calories += Number(v);
    }
    else {
        elfCalories.push(calories);
        calories = 0;
    }
});
elfCalories.push(calories);

// Get answer for part 1
console.log(Math.max(...elfCalories));

elfCalories.sort((a, b) => b-a);
const top3 = elfCalories.slice(0, 3);

// Get sum for part 2
console.log(top3.reduce((s, v) => s +=v, 0));