'use strict';

const https = require('https');
const { URL } = require('url');

async function getRequest(endpoint) {
    const url = new URL(endpoint);
    
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET'
    };
   
    return new Promise((resolve, reject) => {
        const req = https.get(options, async (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function getUserArticles(username) {
    const articleUsersEndpoint = `https://jsonmock.hackerrank.com/api/article_users?username=${username}`;

    return getRequest(articleUsersEndpoint);
}

async function getUserIdByUsername(username) {
    try {
        const { data } = await getUserArticles(username);

        if (data && data.length && data[0] && data[0].id) {
            return data[0].id;
        }

        return null;
    } catch {
        return null;
    }
}

async function getTransactionsByUserId(userId) {
    const transactionsEndpoint = `https://jsonmock.hackerrank.com/api/transactions?&userId=${userId}`;

    return getRequest(transactionsEndpoint);
}

async function getNumTransactions(username) {
    // write your code here
    
    const userId = await getUserIdByUsername(username);

    if (!userId) {
        return 'Username Not Found';
    }

    const data = await getTransactionsByUserId(userId);

    return data.total;
}

async function test() {
    console.log('Transaction count: ', await getNumTransactions('patricktomas'));
    console.log('Transaction count: ', await getNumTransactions('epaga'));
    console.log('Transaction count: ', await getNumTransactions('jay'));
}

test();