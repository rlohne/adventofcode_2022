const fs = require('fs');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `[${this.x},${this.y}]`
    }
}

class Path {
    constructor(points) {
        this.points = points;
        this.minX = Math.min(...points.map(p => p.x));
        this.maxX = Math.max(...points.map(p => p.x));
        this.minY = Math.min(...points.map(p => p.y));
        this.maxY = Math.max(...points.map(p => p.y));
    }

    toString() {
        return this.points.map(v => v.toString()).join(' -> ');
    }
}

class Cave {
    constructor(paths, addFloor) {
        this.sandBlocked = false;
        this.paths = paths;
        this.bounds = {
            min: {x: 0, y: 0},
            max: {x: 1000, y: Math.max(...paths.map(p => p.maxY))}
        };
        if (addFloor) {
            this.bounds.max.y += 2;
        }
        this.interior = Array(this.bounds.max.y - this.bounds.min.y+1);
        for (let i = 0; i < this.interior.length; i++) {
            this.interior[i] = Array(this.bounds.max.x - this.bounds.min.x+1).fill('.')
        }
        this.paths.forEach(e => this.scanPath(e));

        if (addFloor) {
            for (let i = 0; i < this.interior[this.interior.length-1].length; i++) {
                this.interior[this.interior.length-1][i] = '#';
            }
        }
    }

    scanPath(path) {
        let points = path.points;
        for( let i = 1; i < points.length; i++) {
            let line = [points[i-1].x - points[i].x, points[i-1].y - points[i].y];
            let direction = line.map(v => (v === 0) ? 0 : (v / Math.abs(v)));
            let magnitude = Math.sqrt(line[0]*line[0] + line[1]*line[1]);

            for (let v = 0; v <= magnitude; v++) {
                let x = points[i].x + (direction[0]*v) - this.bounds.min.x;
                let y = points[i].y + (direction[1]*v) - this.bounds.min.y;

                this.interior[y][x] = '#';
            }
        }
    }

    dropSand() {
        if (this.sandBlocked) return Infinity;

        let position = [500-this.bounds.min.x, 0];
        let canDropFurther = true;
        while (canDropFurther) {
            if (this.interior[position[1]+1][position[0]] === '.') {
                position = [position[0],position[1]+1];
            }
            else if (this.interior[position[1]+1][position[0]-1] === '.'){
                position = [position[0]-1,position[1]+1];
            }
            else if (this.interior[position[1]+1][position[0]+1] === '.'){
                position = [position[0]+1,position[1]+1];
            }
            else if (this.interior[position[1]+1][position[0]] === undefined) {
                return Infinity;
            }
            else if (this.interior[position[1]+1][position[0]-1] === undefined){
                return Infinity;
            }
            else if (this.interior[position[1]+1][position[0]+1] === undefined){
                return Infinity;
            }
            else if (position[1] === 0 && this.interior[position[1]+1][position[0]] === 'o' && this.interior[position[1]+1][position[0]-1] === 'o' && this.interior[position[1]+1][position[0]+1] === 'o') {
                this.sandBlocked = true;
                canDropFurther = false;
            }
            else {
                canDropFurther = false;
            }
        }

        this.interior[position[1]][position[0]] = 'o';
        return position;
    }

    toString() {
        return this.interior.map(l => l.join('')).join('\n');
    }
}

const fileContents = fs.readFileSync("scan-data.txt").toString("utf-8");
let paths = fileContents.split(/\r?\n/).map(l => new Path(l.split(' -> ').map(s => new Point(...s.split(',').map(v => Number(v))))));

let cave1 = new Cave(paths, false); let sandDropped = 0;
try {
    while(cave1.dropSand() !== Infinity) {
        sandDropped++;
    }
}
catch(e) {
    
}
console.log(`Total sand dropped before abyss ${sandDropped}`);

let cave2 = new Cave(paths, true); sandDropped = 0;
try {
    while(cave2.dropSand() !== Infinity) {
        sandDropped++;
    }
}
catch(e) {
    
}

console.log(`Total sand dropped before blocked ${sandDropped}`);