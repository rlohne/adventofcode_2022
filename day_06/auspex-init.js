const fs = require('fs');

const fileContents = fs.readFileSync("data-stream.txt").toString("utf-8");

function detectFirstMarker(dataBuffer, markerLength) {
    for (let i = 0; i < dataBuffer.length; i++) {
        const window = dataBuffer.slice(i, i+markerLength);
        
        const windowArray = [...window];
        const isMarker = 1 === Math.max(...windowArray.map(l => {
            let count = 0;
            for (let v of windowArray) {
                if (l === v) count++;
            };

            return count;
        }));

        if (isMarker) {
            return i+markerLength;
        }
    }

    return null;
}

// Task 1
const firstMarkerIndex = detectFirstMarker(fileContents, 4);
console.log(`Found start marker at ${firstMarkerIndex}`);

// Task 2
const startMessageIndex = detectFirstMarker(fileContents, 14);
console.log(`Found start message marker at ${startMessageIndex}`);