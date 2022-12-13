const fs = require('fs');
const { MinHeap } = require('@datastructures-js/heap');

class AStarNode {
    constructor(id, value, position, destination) {
        this.id = id;
        this.distance = Infinity;
        this.rootDistance = Infinity;
        this.parent = undefined;
        this.discovered  = false;
        this.value = value;
        this.position = position;
        this.manhattanDistance = (2 * (Math.abs(destination.x - position.x)) + (Math.abs(destination.y - position.y)));
    }
}

class HeightMap {
    constructor(mapData) {
        this.mapData = mapData;
        this.height = mapData.length;
        this.width = mapData[0].length;
    }

    posIsValidTarget(current, target) {
        
        const cLetter = this.normStartStop(this.mapData[current.y][current.x]);
        const tLetter = this.normStartStop(this.mapData[target.y][target.x]);
        const cVal = parseInt(cLetter, 36) - 9;
        const tVal = parseInt(tLetter, 36) - 9;

        //console.log(`Testing [${current.x}, ${current.y}] ${cVal} vs [${target.x}, ${target.y}] ${tVal} with result ${(cVal === tVal) || (cVal === (tVal+1))}`)
        return tVal <= (cVal+1);
    }

    normStartStop(letter) {
        if (letter.charAt(0) === 'S'.charCodeAt(0)) {
            letter = 'a';
        }
        else if (letter.charCodeAt(0) === 'E'.charCodeAt(0)) {
            letter = 'z';
        }

        return letter;
    }

    posIsInBounds(pos) {
        return ((pos.x >= 0 && pos.x < this.width) && (pos.y >= 0 && pos.y < this.height));
    }

    getValidNeighbours(x, y) {
        const potential = [{x: x-1, y: y}, {x: x+1, y}, {x: x, y: y-1}, {x: x, y: y+1}];
        return potential.filter(v => this.posIsInBounds(v) && this.posIsValidTarget({x: x, y: y}, v));
    }

    AStar(start, stop) {
        const astarNodes = this.mapData.map((row, y) => row.map((col, x) => new AStarNode(x*y, col, {x: x, y: y}, stop)));
        const getNodeCompareValue = (n) => n.distance;
        const queue = new MinHeap(getNodeCompareValue);

        // Prep start node
        const startNode = astarNodes[start.y][start.x];
        startNode.rootDistance = 0;
        queue.insert(startNode);

        // Do fancy maths
        while (!queue.isEmpty()) {
            const currentNode = queue.extractRoot();
            currentNode.discovered = true;
            //console.log(`Finding route from [${currentNode.position.x}, ${currentNode.position.y}], ${queue.size()} options remaining`);

            //console.log(this.getValidNeighbours(currentNode.position.x, currentNode.position.y));
            for (let neighbour of this.getValidNeighbours(currentNode.position.x, currentNode.position.y).map(v => astarNodes[v.y][v.x])) {
                neighbour.rootDistance = Math.min(neighbour.rootDistance, currentNode.rootDistance+1);
                
                const minDistance = Math.min(neighbour.distance, neighbour.rootDistance + neighbour.manhattanDistance);
                if(minDistance !== neighbour.distance) {
                    neighbour.distance = minDistance;
                    neighbour.parent = currentNode;
                }

                if (!neighbour.discovered) {
                    neighbour.discovered = true;
                    queue.insert(neighbour);
                }

                queue.fix();
            }
        }

        var navbackNode = astarNodes[stop.x][stop.y];

        if (navbackNode.parent === undefined) {
            return Infinity;
        }
        
        var finalDist = 0; var routes = [` → [${navbackNode.value}, ${navbackNode.position.y}, ${navbackNode.position.x}]`];
        while (navbackNode.rootDistance !== 0) {
            navbackNode = navbackNode.parent;
            routes.push(` → [${navbackNode.value}, ${navbackNode.position.y}, ${navbackNode.position.x}]`);
            navbackNode.value = '#';
            finalDist++;
        }

        /*for (let line of astarNodes) {
            console.log(line.map(v => v.value).join(''));
        }*/
        //console.log(routes.reverse().join(''))
        return finalDist;
    }
}

const fileContents = fs.readFileSync("heightmap.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

let astarts = []; let end = {x: 0, y: 0}; let start = {x: 0, y: 0};
for (let y = 0; y < fileByLine.length; y++) {
    for (let x = 0; x < fileByLine[y].length; x++) {
        if (fileByLine[y].charAt(x) === 'S') {
            start.x = x;
            start.y = y;
        }

        if(fileByLine[y].charAt(x) === 'a') {
            astarts.push({x: x, y: y});
        }

        if(fileByLine[y].charAt(x) === 'E') {
            end.x = y;
            end.y = x;
        }
    }
}

const heightMap = new HeightMap(fileByLine.map(line => line.split('')));


const dists = astarts.map(v => heightMap.AStar(v, end));
const distStart = heightMap.AStar(start, end);

console.log(`Distance from start S ${heightMap.AStar(start, end)}`);
console.log(`Min distance from lowest points ${Math.min(distStart, ...dists)}`);