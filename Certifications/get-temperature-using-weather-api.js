const https = require('https');
const { URL } = require('url');

async function getTemperature(name) {
    const endpoint = `https://jsonmock.hackerrank.com/api/weather?name=${name}`;
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
                    const weather = parsedData.data[0].weather;
                    const temperature = weather.split(' ')[0];
                    resolve(temperature);
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

async function main(name) {
    try {
        const data = await getTemperature(name);
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

main("Oakland");
main("Dallas");