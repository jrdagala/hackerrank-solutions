'use strict';

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
