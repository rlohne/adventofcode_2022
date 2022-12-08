const fs = require('fs');

const fileContents = fs.readFileSync("command-log.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

// Borrowed from reddit as my solution failed to account for full paths and i got stuck :(
const directories = new Map([]);
class Directory {
    constructor(path,parent){
        this.size = 0;
        this.path = path;
        
        this.parent = parent;

        directories.set(path,this);
    }

    addSize(size){
        this.size+=size;
        let currentDir = this.parent;

        while(currentDir){
            currentDir.size+=size;
            currentDir=currentDir.parent;
        }
    }
}

// From here it should be mostly mine
let currentDirectory=new Directory('/',null);
for (let line of fileByLine) {
    
    const tokens = line.split(' ');

    if (tokens[0] === '$') {
        if (tokens[1] === 'cd') {
            if (tokens[2] === '..') {
                currentDirectory=currentDirectory.parent||currentDirectory;

            }
            else if (tokens[2] === '/') {
                currentDirectory=directories.get('/');
            }
            else {
                currentDirectory=new Directory(currentDirectory.path
                    +`${currentDirectory.path.slice(-1)==='/'?'':'/'}`
                    +tokens[2],currentDirectory);
            }
        }
    }
    else if (!isNaN(tokens[0])) {
        currentDirectory.addSize(Number(tokens[0]));
    }
}

const directoryArray = [];
directories.forEach((v,k)=>directoryArray.push(v));
const allSizes = directoryArray.map(a=>a.size);

console.log(directories);
console.log(allSizes.filter(a=>a<=100000).reduce((acc,curr)=>acc+curr,0))

const neededExtraSpace = 30000000-(70000000-directories.get('/').size);
const bigEnoughMinimumSize = Math.min(...allSizes.filter(a=>a>=neededExtraSpace));

console.log(bigEnoughMinimumSize);