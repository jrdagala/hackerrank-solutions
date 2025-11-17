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
 * Complete the 'decryptPassword' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts STRING s as parameter.
 */

function isLowerCase(char) {
    return !!char.match(new RegExp('[a-z]'));
}

function isUpperCase(char) {
    return !!char.match(new RegExp('[A-Z]'));
}

function isNumberWithoutZero(char) {
    return !!char.match(new RegExp('[1-9]'));
}

function encryptPassword(s) {
    let encryptedPassword = [];
    
    for (let i = 0; i < s.length; i++) {
        if((i+1 < s.length) && isLowerCase(s[i]) && isUpperCase(s[i+1])) {
            const x = s[i];
            const y = s[i+1];
            
            encryptedPassword = [...encryptedPassword, y, x, '*']
            i++;
        } else if (isNumberWithoutZero(s[i])) {
            encryptedPassword = [s[i], ...encryptedPassword, '0'];
        } else {
            encryptedPassword.push(s[i]);
        }
    }
    
    return encryptedPassword.join('');
}

function decryptPassword(s) {
    // Write your code here
    let decryptedPassword = [];
    let numbersInPassword = [];

    for (let i = 0; i < s.length; i++) {
        if((i+1 < s.length) && isLowerCase(s[i+1]) && isUpperCase(s[i]) && (s[i+2] === '*')) {
            const x = s[i];
            const y = s[i+1];
            
            decryptedPassword = [...decryptedPassword, y, x]
            i+=2;
        } else if (isNumberWithoutZero(s[i])) {
            numbersInPassword.push(s[i]);
        } else if (s[i] === '0') {
          decryptedPassword.push(numbersInPassword.pop());
        } else {
            decryptedPassword.push(s[i]);
        }
    }
    return decryptedPassword.join('');
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const s = readLine();

    const result = decryptPassword(s);

    ws.write(result + '\n');

    ws.end();
}
