const fs = require('fs');

const fileContents = fs.readFileSync("height-map.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

const rowNum = fileByLine.length;
const colNum = fileByLine[0].length;

function testVisibility(x, y, vectors) {
    const height = Number(fileByLine[y].charAt(x));

    const visibilityDirections = [];
    for (let v of vectors) {
        let isVisible = true; ; let isInBounds = true; let i = 1;
        while (isInBounds) {
            const currentLoc = [i*v[0]+y,i*v[1]+x];
            if ((currentLoc[0] < 0 || currentLoc[1] < 0) || (currentLoc[0] >= colNum || currentLoc[1] >= rowNum)) {
                isInBounds = false;
            }

            if (isInBounds) {
                const locHeight = Number(fileByLine[currentLoc[0]].charAt(currentLoc[1]));
                if (height <= locHeight) {
                    isVisible = false;
                    break;
                }
            }
            
            i++;
        }
        visibilityDirections.push(isVisible);
    }

    return visibilityDirections.reduce((c, v) => v || c, false);
}

function scenicScore(x, y, vectors) {
    const height = Number(fileByLine[y].charAt(x));

    const visibilityDirections = [];
    for (let v of vectors) {
        let isVisible = true; ; let isInBounds = true; let i = 1;
        while (isInBounds) {
            const currentLoc = [i*v[0]+y,i*v[1]+x];
            if ((currentLoc[0] < 0 || currentLoc[1] < 0) || (currentLoc[0] >= colNum || currentLoc[1] >= rowNum)) {
                isInBounds = false;
                visibilityDirections.push(i-1);
            }

            if (isInBounds) {
                const locHeight = Number(fileByLine[currentLoc[0]].charAt(currentLoc[1]));
                if (height <= locHeight) {
                    
                    isVisible = false;
                    visibilityDirections.push(i);
                    break;
                }
            }
            
            i++;
        }
    }
    
    return visibilityDirections.reduce((c, v) => c =  c*v, 1);
}

const numInternalRows = fileByLine.length-1;
const numInternalColumns = fileByLine[0].length-1;
const outsideVisibleTrees = (fileByLine.length*2)+(fileByLine[0].length*2)-4;

const leftVec = [-1, 0];
const rightVec = [1, 0];
const upVec = [0,-1];
const downVec = [0,1];
const testDirections = [leftVec, rightVec, upVec, downVec];

let internalVisible = 0;
let maxScore = 0;
for (let y = 1; y < numInternalRows; y++) {
    for (let x = 1; x < numInternalColumns; x++) {

        // Task 1
        if (testVisibility(x, y, testDirections)) {
            internalVisible++;
        }

        // Task 2
        const locScore = scenicScore(x, y, testDirections);
        if (locScore > maxScore) maxScore = locScore;
    }    
}

console.log(`Visible tress ${outsideVisibleTrees+internalVisible} (outer ring ${outsideVisibleTrees}, internal ${internalVisible})`);
console.log(`Max scenic score ${maxScore}`);