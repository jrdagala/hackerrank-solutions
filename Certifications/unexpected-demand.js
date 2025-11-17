'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'filledOrders' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER_ARRAY order
 *  2. INTEGER k
 */

function filledOrders(orders, k) {
    // Write your code here
    // Sort orders in ascending order to maximize the number of orders filled
    const sortedOrders = [...orders].sort((a, b) => a - b);
    let countOrders = 0;
    
    for (let i = 0; i < sortedOrders.length ; i++) {
        const order = sortedOrders[i];
        if(order <= k) {
            k = k - order;
            countOrders++;
        }
    }
    
    return countOrders;    
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const orderCount = parseInt(readLine().trim(), 10);

    let order = [];

    for (let i = 0; i < orderCount; i++) {
        const orderItem = parseInt(readLine().trim(), 10);
        order.push(orderItem);
    }

    const k = parseInt(readLine().trim(), 10);

    const result = filledOrders(order, k);

    ws.write(result + '\n');

    ws.end();
}
