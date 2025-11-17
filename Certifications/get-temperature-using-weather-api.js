const https = require('https');
const { URL } = require('url');

// getTemperature retrieves the temperature for a given city name from the weather API.
// Returns the temperature value extracted from the weather data string.
async function getTemperature(name) {
    // Construct the API endpoint URL with the city name as a query parameter
    const endpoint = `https://jsonmock.hackerrank.com/api/weather?name=${name}`;
    const url = new URL(endpoint);
    
    // Configure HTTPS request options
    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'GET'
    };

    // Create a Promise to handle the asynchronous HTTPS request
    return new Promise((resolve, reject) => {
        const req = https.get(options, async (res) => {
            // Accumulate response data chunks
            let data = '';

            // Collect data chunks as they arrive
            res.on('data', (chunk) => {
                data += chunk;
            });

            // Process the complete response when all data has been received
            res.on('end', () => {
                try {
                    // Parse the JSON response
                    const parsedData = JSON.parse(data);
                    // Extract the weather string from the first data entry
                    const weather = parsedData.data[0].weather;
                    // Extract the temperature (first part before the space, e.g., "25" from "25 degree")
                    const temperature = weather.split(' ')[0];
                    resolve(temperature);
                } catch (error) {
                    // Handle parsing errors or missing data
                    reject(error);
                }
            });
        });

        // Handle network or request errors
        req.on('error', (error) => {
            reject(error);
        });

        // Send the request
        req.end();
    });
}

// main calls getTemperature for a given city name and logs the result, handling any errors that occur.
async function main(name) {
    try {
        // Fetch the temperature for the specified city
        const data = await getTemperature(name);
        // Display the temperature
        console.log(data);
    } catch (error) {
        // Log any errors that occur during the API call or data processing
        console.error('Error:', error);
    }
}

// Test the function with different city names
main("Oakland");
main("Dallas");