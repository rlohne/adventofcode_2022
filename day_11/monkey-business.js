class Monkey {
    constructor(id, items, operation, test, trueTarget, falseTarget, remainder) {
        this.id = id;
        this.items = items;
        this.operation = operation;
        this.test = test;
        this.trueTarget = trueTarget;
        this.falseTarget = falseTarget;
        this.totalInspections = 0;
        this.remainder = remainder;
    }

    inspect(simple) {
        this.totalInspections++;

        let item = this.items.shift();
        //console.log(`\tMonkey inspects ${item}`);

        if (!simple) item %= this.remainder;

        item = this.operation(item);
        //console.log(`\t\tUpon inspection worry level increases to ${item}`);

        if (simple) item = Math.floor(item/3);
        //console.log(`\t\tFlooded by relief item is now ${item}`);

        if (this.test(item)) {
            return {item: item, target: this.trueTarget};
        }
        else {
            return {item: item, target: this.falseTarget};
        }
    }

    hasItems() {
        return this.items.length > 0;
    }
}

/*
const remainder = 1 * 23 * 19 * 13 * 17;
const monkies = [
    new Monkey(0, [79, 98], (v) => v * 19, (v) => (v % 23) === 0, 2, 3, remainder),
    new Monkey(1, [54, 65, 75, 74], (v) => v + 6, (v) => (v % 19) === 0, 2, 0, remainder),
    new Monkey(2, [79, 60, 97], (v) => v * v, (v) => (v % 13) === 0, 1, 3, remainder),
    new Monkey(3, [74], (v) => v + 3, (v) => (v % 17) === 0, 0, 1, remainder)
];*/
const remainder = 1 * 2* 7 * 11 * 19 * 3 * 5 * 17 * 13;
const monkies = [
    new Monkey(0, [66, 59, 64, 51], (v) => v * 3, (v) => (v % 2) === 0, 1, 4, remainder),
    new Monkey(1, [67, 61], (v) => v * 19, (v) => (v % 7) === 0, 3, 5, remainder),
    new Monkey(2, [86, 93, 80, 70, 71, 81, 56], (v) => v + 2, (v) => (v % 11) === 0, 4, 0, remainder),
    new Monkey(3, [94], (v) => v * v, (v) => (v % 19) === 0, 7, 6, remainder),
    new Monkey(4, [71, 92, 64], (v) => v + 8, (v) => (v % 3) === 0, 5, 1, remainder),
    new Monkey(5, [58, 81, 92, 75, 56], (v) => v + 6, (v) => (v % 5) === 0, 3, 6, remainder),
    new Monkey(6, [82, 98, 77, 94, 86, 81], (v) => v + 7, (v) => (v % 17) === 0, 7, 2, remainder),
    new Monkey(7, [54, 95, 70, 93, 88, 93, 63, 50], (v) => v + 4, (v) => (v % 13) === 0, 2, 0, remainder),
];

for (let i = 10000; 0 < i; i--) {
    for (let monkey of monkies) {
        //console.log(`Rounds remaining ${i}, monkey ${monkey.id}`);
        while(monkey.hasItems()) {
            const result = monkey.inspect();
            //console.log(`\tMonkey ${monkey.id} throws item ${result.item} to monkey ${result.target}\n`);
            monkies[result.target].items.unshift(result.item);
        }
    }

    if (i % 1000 === 0) {
        for (let monkey of monkies) {
            console.log(`${monkey.id}: ${monkey.totalInspections}`);
        }
        console.log('');
    }
}

/*for (let monkey of monkies) {
    console.log(`${monkey.id}: ${monkey.totalInspections}`);
}*/

const activitySorted = monkies.map(m => m.totalInspections).sort((a,b) => b-a);
const mbLevel = activitySorted[0]*activitySorted[1];


console.log(`Monkey business level ${mbLevel}`);