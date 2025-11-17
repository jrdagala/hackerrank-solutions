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

async function getRequestForAllPages(endpoint, page = 1) {
    const response = await getRequest(`${endpoint}&page=${page}`);

    if (page === response.total_pages) {
        if (response && response.data && response.data.length) {
            return response.data
        } else {
            return [];
        }
    } else {
        const data = await getRequestForAllPages(endpoint, page + 1);
        return [...response.data, ...data];
    }
}

async function getFootballCompetitionLeagueWinner(competitionName, year) {
    
    let endpoint = `https://jsonmock.hackerrank.com/api/football_competitions?year=${year}`;
    endpoint += `&name=${encodeURIComponent(competitionName)}`;

    const response = await getRequest(endpoint);

    if (response && response.data && response.data.length && response.data[0]) {
        return response.data[0].winner;
    } else {
        return null;
    }
}

async function getGoalsByCompetitionTeamNameAndYear(competitionName, teamName, year) {
    
    let team1Endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
    team1Endpoint += `&competition=${encodeURIComponent(competitionName)}`;
    team1Endpoint += `&team1=${encodeURI(teamName)}`;
    
    let team2Endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
    team2Endpoint += `&competition=${encodeURIComponent(competitionName)}`;
    team2Endpoint += `&team2=${encodeURI(teamName)}`;
    
    const team1Results = await getRequestForAllPages(team1Endpoint);
    const team2Results = await getRequestForAllPages(team2Endpoint);

    const team1TotalGoals = team1Results.reduce(function(totalGoals, data) { 
        return totalGoals + parseInt(data.team1goals)
    }, 0);

    const team2TotalGoals = team2Results.reduce(function(totalGoals, data) { 
        return totalGoals + parseInt(data.team2goals)
    }, 0);


    return team1TotalGoals + team2TotalGoals;

}

async function getWinnerTotalGoals(competition, year) {
    const competitionWinnerName = await getFootballCompetitionLeagueWinner(competition, year);

    return getGoalsByCompetitionTeamNameAndYear(competition, competitionWinnerName, year);
}


// The code below is used to test the function getWinnerTotalGoals.

function testResult(goals, expectedGoals) {
    return goals === expectedGoals ? 'passed' : 'failed';
}

async function main() {
    const testData1 = {
        name: 'English Premier League',
        year: 2014,
        expectedGoals: 73,
    };
    const testData2 = {
        name: 'La Liga',
        year: 2012,
        expectedGoals: 115,
    };
    const testData3 = {
        name: 'UEFA Champions League',
        year: 2011,
        expectedGoals: 28,
    };

    for (const data of [testData1, testData2, testData3]) {
        const winnerGoals = await getWinnerTotalGoals(data.name, data.year);
        console.log(`Competition: ${data.name} - Test result: `, testResult(winnerGoals, data.expectedGoals))
    }
    // UEFA Champions League - year: 2011 - goals 28
    // La Liga - year: 2012 - goals 115
    // English Premier League - year: 2014 - goals 73
}

main();