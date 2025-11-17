"use strict";

const https = require("https");
const { URL } = require("url");

// getRequest makes an HTTPS GET request to the specified endpoint and returns the parsed JSON response.
async function getRequest(endpoint) {
  const url = new URL(endpoint);

  // Configure HTTPS request options
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "GET",
  };

  // Create a Promise to handle the asynchronous HTTPS request
  return new Promise((resolve, reject) => {
    const req = https.get(options, async (res) => {
      // Accumulate response data chunks
      let data = "";

      // Collect data chunks as they arrive
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Process the complete response when all data has been received
      res.on("end", () => {
        try {
          // Parse the JSON response
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          // Handle JSON parsing errors
          reject(error);
        }
      });
    });

    // Handle network or request errors
    req.on("error", (error) => {
      reject(error);
    });

    // Send the request
    req.end();
  });
}

// getUserArticles retrieves article user data for a given username from the API.
async function getUserArticles(username) {
  const articleUsersEndpoint = `https://jsonmock.hackerrank.com/api/article_users?username=${username}`;

  return getRequest(articleUsersEndpoint);
}

// getUserIdByUsername extracts the user ID from the article users API response for a given username.
// Returns the user ID if found, or null if the username doesn't exist or an error occurs.
async function getUserIdByUsername(username) {
  try {
    // Fetch user article data
    const { data } = await getUserArticles(username);

    // Check if user data exists and has an ID
    if (data && data.length && data[0] && data[0].id) {
      return data[0].id;
    }

    // Return null if user not found
    return null;
  } catch {
    // Return null on any error
    return null;
  }
}

// getTransactionsByUserId retrieves all transactions for a given user ID from the API.
async function getTransactionsByUserId(userId) {
  const transactionsEndpoint = `https://jsonmock.hackerrank.com/api/transactions?&userId=${userId}`;

  return getRequest(transactionsEndpoint);
}

// getNumTransactions retrieves the total number of transactions for a given username.
// Returns the transaction count if the username exists, or "Username Not Found" if it doesn't.
async function getNumTransactions(username) {
  // First, get the user ID from the username
  const userId = await getUserIdByUsername(username);

  // If user ID is not found, return error message
  if (!userId) {
    return "Username Not Found";
  }

  // Fetch transactions for the user ID
  const data = await getTransactionsByUserId(userId);

  // Return the total number of transactions
  return data.total;
}

// test runs test cases to verify the getNumTransactions function works correctly.
// Tests include valid usernames and a non-existent username scenario.
async function test() {
  // Test case 1: Valid username with expected transaction count
  const testData1 = {
    username: "patricktomas",
    expectedTransactionCount: 76,
  };
  // Test case 2: Another valid username with expected transaction count
  const testData2 = {
    username: "epaga",
    expectedTransactionCount: 79,
  };
  // Test case 3: Non-existent username that should return "Username Not Found"
  const testData3 = {
    username: "jeffrobertdagala",
    expectedTransactionCount: "Username Not Found",
  };
  
  // Run tests for each test case
  for (const data of [testData1, testData2, testData3]) {
    const transactionCount = await getNumTransactions(data.username);
    // Log test results comparing actual vs expected values
    console.log(
      "Transaction Count: ",
      transactionCount,
      " --- Expected Transaction Count: ",
      data.expectedTransactionCount,
      " --- Test Result: ",
      transactionCount === data.expectedTransactionCount ? "PASSED" : "FAILED"
    );
  }
}

// Run the test suite
test();
