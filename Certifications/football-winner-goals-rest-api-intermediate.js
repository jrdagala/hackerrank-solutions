const https = require("https");
const { URL } = require("url");

// getRequest makes an HTTPS GET request to the specified endpoint and returns the parsed JSON response.
async function getRequest(endpoint) {
  const url = new URL(endpoint);

  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "GET",
  };

  return new Promise((resolve, reject) => {
    const req = https.get(options, async (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// getRequestForAllPages fetches all pages of data from a paginated API endpoint and combines the results into a single array.
async function getRequestForAllPages(endpoint, page = 1) {
  const response = await getRequest(`${endpoint}&page=${page}`);

  if (page === response.total_pages) {
    if (response && response.data && response.data.length) {
      return response.data;
    } else {
      return [];
    }
  } else {
    const data = await getRequestForAllPages(endpoint, page + 1);
    return [...response.data, ...data];
  }
}

// getFootballCompetitionLeagueWinner retrieves the winner of a football competition for a given year.
// Returns the winner team name if found, or null if the competition is not found.
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

// getGoalsByCompetitionTeamNameAndYear calculates the total goals scored by a team in a specific competition and year.
// Makes two requests because the team can appear as either team1 or team2 in different matches.
async function getGoalsByCompetitionTeamNameAndYear(
  competitionName,
  teamName,
  year
) {
  let team1Endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
  team1Endpoint += `&competition=${encodeURIComponent(competitionName)}`;
  team1Endpoint += `&team1=${encodeURI(teamName)}`;

  let team2Endpoint = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}`;
  team2Endpoint += `&competition=${encodeURIComponent(competitionName)}`;
  team2Endpoint += `&team2=${encodeURI(teamName)}`;

  const team1Results = await getRequestForAllPages(team1Endpoint);
  const team2Results = await getRequestForAllPages(team2Endpoint);

  // Calculating total goals across all matches
  const team1TotalGoals = team1Results.reduce(function (totalGoals, data) {
    return totalGoals + parseInt(data.team1goals);
  }, 0);

  const team2TotalGoals = team2Results.reduce(function (totalGoals, data) {
    return totalGoals + parseInt(data.team2goals);
  }, 0);

  return team1TotalGoals + team2TotalGoals;
}

// getWinnerTotalGoals retrieves the total goals scored by the winner of a competition in a given year.
async function getWinnerTotalGoals(competition, year) {
  const competitionWinnerName = await getFootballCompetitionLeagueWinner(
    competition,
    year
  );

  return getGoalsByCompetitionTeamNameAndYear(
    competition,
    competitionWinnerName,
    year
  );
}

// The code below is used to test the function getWinnerTotalGoals.

// testResult compares the actual goals with expected goals and returns 'passed' or 'failed'.
function testResult(goals, expectedGoals) {
  return goals === expectedGoals ? "passed" : "failed";
}

// main runs test cases for the getWinnerTotalGoals function with different competitions and years.
async function main() {
  const testData1 = {
    name: "English Premier League",
    year: 2014,
    expectedGoals: 73,
  };
  const testData2 = {
    name: "La Liga",
    year: 2012,
    expectedGoals: 115,
  };
  const testData3 = {
    name: "UEFA Champions League",
    year: 2011,
    expectedGoals: 28,
  };

  for (const data of [testData1, testData2, testData3]) {
    const winnerGoals = await getWinnerTotalGoals(data.name, data.year);
    console.log(
      `Competition: ${data.name} - Test result: `,
      testResult(winnerGoals, data.expectedGoals)
    );
  }
  // UEFA Champions League - year: 2011 - goals 28
  // La Liga - year: 2012 - goals 115
  // English Premier League - year: 2014 - goals 73
}

main();
