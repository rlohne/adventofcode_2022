const fs = require('fs')
const performance = require('perf_hooks').performance
const eol = require('os').EOL
 
let startTime = performance.now()
let part1 = part2 = 0
let input = fs.readFileSync(__dirname + "/data.txt", 'utf8').split(eol + eol)
 
function op(operation, val) {
    let val2 = operation[1] == 'old' ? val : operation[1]
    if (operation[0] == "*") return +val * +val2
    if (operation[0] == "+") return +val + +val2
}
 
function solve(runs, p1) {
    let supermod = 1
    let monkeys = input.map(item => {
        let data = item.split(eol)
        supermod *= +data[3].replace(/[^\d.]/g, '')
        console.log(`Monkey supermod ${supermod}`);
        return {
            count: 0,
            balls: data[1].split('  Starting items: ')[1].split(', ').map(Number),
            op: data[2].split('  Operation: new = old ')[1].split(' '),
            worry: +data[3].replace(/[^\d.]/g, ''),
            worryTrue: +data[4].replace(/[^\d.]/g, ''),
            worryFalse: +data[5].replace(/[^\d.]/g, '')
        }
    })
    for (let index = 0; index < runs; index++) {
        for (const monkey of monkeys) {
            for (let i = 0; i < monkey.balls.length; i++) {
                let old = monkey.balls.pop()
                if (!p1) old %= supermod
                let worry = op(monkey.op, old)
                if (p1) worry = Math.floor(worry / 3)
                let throwTo = worry % monkey.worry == 0 ? monkey.worryTrue : monkey.worryFalse
                monkeys[throwTo].balls.push(worry)
                monkey.count++
            }
        }
    }
    monkeys.sort((a, b) => b.count - a.count)
    return monkeys[0].count * monkeys[1].count
}
part1 = solve(20, true)
part2 = solve(10000, false)
let time = performance.now() - startTime
console.log(`Part 1: ${part1}\nPart 2: ${part2}\nTimer: ${time} ms`)