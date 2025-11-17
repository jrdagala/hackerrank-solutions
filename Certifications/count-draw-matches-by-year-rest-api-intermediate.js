const https = require('https');
const { URL } = require('url');

// getRequest makes an HTTPS GET request to the specified endpoint and returns the parsed JSON response.
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

// getFootballMatchesByYearByGoals retrieves football matches for a given year where both teams scored the same number of goals (draw matches).
async function getFootballMatchesByYearByGoals(year, goals) {
    let endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
    endpoint += `&team1goals=${goals}`;
    endpoint += `&team2goals=${goals}`;
    
    return getRequest(endpoint);
}

// getNumDraws calculates the total number of draw matches (ties) for a given year.
// It checks all possible goal scores from 0 to 10 (assuming no team scores more than 10 goals).
async function getNumDraws(year) {
    // Constraints:
    // Assume that no team ever scored more than 10 goals.
    const maxGoalPerGame = 10;
    let totalGameDraws = 0;
    for (let goals = 0; goals <= maxGoalPerGame; goals++) {
        const data = await getFootballMatchesByYearByGoals(year, goals);
        if (data && data.total) {
            totalGameDraws += data.total;
        }
    }
    
    return totalGameDraws;
}

// test runs getNumDraws for a given year and logs the result.
async function test(year) {
    const drawGameCount = await getNumDraws(year);
    console.log(`There are ${drawGameCount} games that score draw on year ${year}`);
}

// main runs test cases for multiple years (2010-2017) to count draw matches.
async function main() {
    await test(2010);
    await test(2011);
    await test(2012);
    await test(2013);
    await test(2014);
    await test(2015);
    await test(2016);
    await test(2017);
}

main();