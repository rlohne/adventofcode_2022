const fs = require('fs');

const fileContents = fs.readFileSync("program.txt").toString("utf-8");
const fileByLine = fileContents.split(/\r?\n/);

class IInstruction {
    constructor(numCycles) {
        this.numCycles = numCycles;
        this.remainingCycles = numCycles;
    }

    tick() {
        this.remainingCycles--;
        if (this.remainingCycles === 0) {
            this.applyResult();
        }
    }
}

class NoopInstruction extends IInstruction {
    constructor(comDevice) {
        super(1);
        this.comDevice = comDevice;
    }

    applyResult() {

    }
}

class AddxInstruction extends IInstruction {
    constructor(comDevice, toAdd) {
        super(2);
        this.toAdd = toAdd;
        this.comDevice = comDevice;
    }

    applyResult() {
        //console.log(`Adding ${this.toAdd} to X register (${this.comDevice.xRegister})`);
        this.comDevice.xRegister += this.toAdd;
    }
}

class ComDevice {
    constructor(xRegister) {
        this.xRegister = xRegister;
        this.numCycles = 0;
        this.sigStrengthOffset = 20;
        this.sigStrengthFrequency = 40;
        this.sigStrengthSum = 0;
    }

    tick() {
        this.numCycles++;
        if ((this.numCycles + this.sigStrengthOffset) % this.sigStrengthFrequency === 0) {
            let sigStrength = this.xRegister * this.numCycles;
            this.sigStrengthSum += sigStrength;

            //console.log(`Sigstrength triggered on cycle ${this.numCycles}, sigstrength ${sigStrength} and sum ${this.sigStrengthSum}`);
        }
    }
}

class CRT {
    constructor(comDevice) {
        this.comDevice = comDevice;
        this.screen = Array(6);

        for (let i = 0; i < this.screen.length; i++) {
            this.screen[i] = Array(40).fill('.');
        }
    }

    getXPos() {
        return this.comDevice.numCycles % 40;
    }

    getYPos() {
        return (Math.floor(this.comDevice.numCycles / 40) % 6)
    }

    getPixel() {
        const xPos = this.getXPos();
        const pos = this.comDevice.xRegister+1;
        if ((pos-1) === xPos || pos === xPos || (pos+1) === xPos) {
            return '#';
        }
        
        return '.';
    }

    tick() {
        // console.log(`Drawing pos ${this.getXPos()}, sprite center ${this.comDevice.xRegister}, drawing ${this.getPixel()}`)
        this.screen[this.getYPos()][this.getXPos()-1] = this.getPixel();
    }

    print() {
        for (let row of this.screen) {
            console.log(row.join(''));
        }
    }
}

let comDevice = new ComDevice(1);
let crt = new CRT(comDevice);
for (let line of fileByLine) {
    let tokens = line.split(' ');

    let instruction;
    if (tokens[0] == "noop") {
        instruction = new NoopInstruction(comDevice);
    }
    else if (tokens[0] == "addx") {
        instruction = new AddxInstruction(comDevice, Number(tokens[1]));
    }
    while(instruction.remainingCycles !== 0) {
        comDevice.tick();
        crt.tick();
        //console.debug(`${comDevice.numCycles}: ${tokens[0]} command ${comDevice.xRegister}`);
        instruction.tick();
    }
}

crt.print();
console.log(comDevice.sigStrengthSum);