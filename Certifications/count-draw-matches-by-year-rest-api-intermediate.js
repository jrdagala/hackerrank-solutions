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

async function getFootballMatchesByYearByGoals(year, goals) {
    
    let endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
    endpoint += `&team1goals=${goals}`;
    endpoint += `&team2goals=${goals}`;
    
    return getRequest(endpoint);
}

//Get the number of games ended up with draw score.
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

async function test(year) {
    const drawGameCount = await getNumDraws(year);
    console.log(`There are ${drawGameCount} games that score draw on year ${year}`);
}

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