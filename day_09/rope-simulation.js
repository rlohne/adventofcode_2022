const { start } = require("repl");
const fs = require('fs');
const { threadId } = require("worker_threads");

const fileContents = fs.readFileSync("rope-moves.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visitedBy = new Set();
        this.occupants = [];
    }
}

class Segment {
    constructor(id, position, previousSegment) {
        this.id = id;
        this.position = position;
        this.lastPosition = undefined;
        this.previousSegment = previousSegment;
    }

    move(newposition) {
        this.lastPosition = this.position;
        this.position = newposition;
    }

    followPreviousSegment() {
        const direction = {x: this.previousSegment.position.x - this.position.x, y: this.previousSegment.position.y - this.position.y};
        const scaled = {x: (direction.x === 0) ? 0 :  direction.x/Math.abs(direction.x), y: (direction.y === 0) ? 0 : direction.y/Math.abs(direction.y)};

        this.move({x: this.position.x + scaled.x, y: this.position.y + scaled.y});
    }

    isAdjecent() {
        const testDirections = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [-1,1], [1,-1], [-1,-1], [0,0]];

        while (testDirections.length > 0) {
            const testVec = testDirections.pop();
            const currentLoc = [testVec[0]+this.position.x,testVec[1]+this.position.y];
            if((currentLoc[0] == this.previousSegment.position.x) && (currentLoc[1] == this.previousSegment.position.y)) {
                return true;
            }
        }

        return false;
    }
}

class Plane {
    constructor(width, height, ropeLength) {
        this.width = width;
        this.height = height;
        this.plane = Array(height);
        this.rope = Array(ropeLength);

        this.moveDirections = {
            "U": [0,-1],
            "D": [0,1],
            "L": [-1,0],
            "R": [1,0]
        }

        for(let y = 0; y < height; y++) {
            let newRow = Array(width);

            for (let x = 0; x < width; x++) {
                newRow[x] = new Cell(x, y);
            }
            this.plane[y] = newRow;
        }

        this.startPos = {x: Math.floor(width/2), y: Math.floor(height/2)};

        for (let i = 0; i < ropeLength; i++) {
            this.rope[i] = new Segment(i, this.startPos, this.rope[i-1] ?? undefined);
        }
    }

    move(dir, steps) {
        for (let i = steps; i > 0; i--) {
            this.step(dir);
        }
    }

    step(dir) {
        const nextLoc = [this.moveDirections[dir][0]+this.rope[0].position.x,this.moveDirections[dir][1]+this.rope[0].position.y];

        this.rope[0].move({x: nextLoc[0], y: nextLoc[1]});

        for (let i = 1; i < this.rope.length; i++) {
            if (!this.rope[i].isAdjecent()) {
                this.rope[i].followPreviousSegment();
                this.plane[this.rope[i].position.x][this.rope[i].position.y].visitedBy.add(this.rope[i].id);
            }
        }
    }

    print() {
        for (let line of this.plane) {
            let str = ""
            for  (let cell of line) {
                if (this.rope[0].position.x == cell.y && this.rope[0].position.y == cell.x) {
                    str += 'H';
                }
                else {
                    let char = "-";
                    if (cell.visitedBy.size > 0) {
                        char = '#';
                    }
                    for (let segment of this.rope) {
                        if (segment.position.x == cell.y && segment.position.y == cell.x) {
                            char = `${segment.id}`;
                        }
                    }
                    str += char;
                }
            }
            console.log(str);
        }
    }
}

var plane = new Plane(1200,1200, 10);
// plane.print();
for (let move of fileByLine) {
    const tokens = move.split(' ');

    //console.log(`\n=== ${move} ===\n`)
    plane.move(tokens[0], Number(tokens[1]));
    //plane.print();

}

let task1 = 0; let task2 = 1;
for (let row of plane.plane) {
    for(let cell of row) {
        if (cell.visitedBy.has(1)) {
            task1++;
        }
        if (cell.visitedBy.has(9)) {
            task2++;
        }
    }
}
console.log(`Total cells visited by second segment is  ${task1}`);
console.log(`Total cells visited by last segment is  ${task2}`);