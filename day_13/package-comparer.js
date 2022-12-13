const fs = require('fs');

const fileContents = fs.readFileSync("com-packets.txt").toString("utf-8");
let fileByChunk = fileContents.split(/\r?\n\r?\n/).map(l => l.split(/\r?\n/).map(s => JSON.parse(s)));

const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(deepCopy(elem))
      }else{
          copy.push(elem)
      }
    })
    return copy;
  }

function compareValues(left, right) {
    left = deepCopy(left);
    right = deepCopy(right);
    let result = 0;
    while((left.length > 0 && right.length > 0) && result === 0) {
        let leftItem = left.shift();
        let rightItem = right.shift();

        var leftIsArray = Array.isArray(leftItem);
        var rightIsArray = Array.isArray(rightItem);

        //console.log(`Comparing ${leftItem} ${leftIsArray} and ${rightItem} ${rightIsArray}`);
        
        if (leftIsArray && rightIsArray) {
            //console.log(`${leftItem} and ${rightItem} are arrays, nest`)
            result = compareValues(leftItem, rightItem);
        }
        else if (leftIsArray) {
            //console.log(`${leftItem} is an array, nest`)
            rightItem = [rightItem];
            result = compareValues(leftItem, rightItem);
        }
        else if (rightIsArray) {
            //console.log(`${rightItem} is an array, nest`)
            leftItem = [leftItem];
            result = compareValues(leftItem, rightItem)
        }
        else {
            if (leftItem !== rightItem) {
                //console.log(`Left ${leftItem} and ${rightItem}, result is ${leftItem<rightItem}`);
                result = (leftItem < rightItem) ? 1 : -1;
            }
        }
    }

    if (result === 0) {
        if (left.length === 0 && right.length === 0) {
            return 0;
        }
        
        result = (left.length === 0) ? 1 : -1;
    }

    //console.log(`Comparing ${left} and ${right}, ${result}`);

    return result;
}

// Part 1
let chunkCounter = 1;
let accumulator = 0;
for (let chunk of fileByChunk) {
    //console.log(`=== Package ${chunkCounter} ===`);
    const result = compareValues(chunk[0], chunk[1]);
    if (result === 1) {
        //console.log(`Inputs are in the right order`);
        accumulator += chunkCounter;
    }
    else {
        //console.log(`Inputs are NOT in the right order`);
    }
    chunkCounter++;
}
console.log(`\nSum of indices ${accumulator}`);

// Part 2
fileByChunk = fileContents.split(/\r?\n\r?\n/).map(l => l.split(/\r?\n/).map(s => JSON.parse(s)));
const orderedPackets = [[[2]],[[6]], ...fileByChunk.flat()].sort(compareValues).reverse().map(v => JSON.stringify(v));

var signal1 = orderedPackets.findIndex(v => v === '[[2]]')+1;
var signal2 = orderedPackets.findIndex(v => v === '[[6]]')+1;

console.log(`Decoder key is ${signal1*signal2}`)