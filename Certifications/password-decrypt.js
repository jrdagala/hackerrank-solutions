"use strict";

/*
 * Complete the 'decryptPassword' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts STRING s as parameter.
 */

// isLowerCase checks if a character is a lowercase letter (a-z).
function isLowerCase(char) {
  return !!char.match(new RegExp("[a-z]"));
}

// isUpperCase checks if a character is an uppercase letter (A-Z).
function isUpperCase(char) {
  return !!char.match(new RegExp("[A-Z]"));
}

// isNumberWithoutZero checks if a character is a digit from 1-9 (excluding 0).
function isNumberWithoutZero(char) {
  return !!char.match(new RegExp("[1-9]"));
}

// decryptPassword decrypts an encrypted password by reversing the encryption rules:
// 1. If uppercase + lowercase + '*': swap them back (uppercase, lowercase)
// 2. If a digit (1-9): store it in a stack for later use
// 3. If '0': replace with the last stored number (LIFO - stack)
// 4. Otherwise: keep the character as is
function decryptPassword(s) {
  let decryptedPassword = [];
  // Stack to store numbers that will be used when we encounter '0'
  let numbersInPassword = [];

  for (let i = 0; i < s.length; i++) {
    // Rule 1: Reverse the swap - if uppercase + lowercase + '*', swap back
    if (
      i + 1 < s.length &&
      isLowerCase(s[i + 1]) &&
      isUpperCase(s[i]) &&
      s[i + 2] === "*"
    ) {
      const x = s[i]; // uppercase
      const y = s[i + 1]; // lowercase

      // Swap back: lowercase first, then uppercase (original order)
      decryptedPassword = [...decryptedPassword, y, x];
      i += 2; // Skip the next two characters ('*' and lowercase)
    }
    // Rule 2: Store numbers in a stack (LIFO) for later replacement
    else if (isNumberWithoutZero(s[i])) {
      numbersInPassword.push(s[i]);
    }
    // Rule 3: Replace '0' with the last stored number (pop from stack)
    else if (s[i] === "0") {
      decryptedPassword.push(numbersInPassword.pop());
    }
    // Rule 4: Keep other characters as is
    else {
      decryptedPassword.push(s[i]);
    }
  }
  return decryptedPassword.join("");
}

// I have written the script to encrypt the password based on Hackerrank's problem.
// encryptPassword encrypts a password using the following rules:
// 1. If lowercase letter followed by uppercase: swap them and add '*'
// 2. If a digit (1-9): move it to the front and replace the digit's position with '0'
// 3. Otherwise: keep the character as is
function encryptPassword(s) {
  let encryptedPassword = [];

  for (let i = 0; i < s.length; i++) {
    // Rule 1: Swap lowercase-uppercase pairs and add '*'
    if (i + 1 < s.length && isLowerCase(s[i]) && isUpperCase(s[i + 1])) {
      const x = s[i]; // lowercase
      const y = s[i + 1]; // uppercase

      // Swap: uppercase first, then lowercase, then '*'
      encryptedPassword = [...encryptedPassword, y, x, "*"];
      i++; // Skip the next character since we've processed it
    }
    // Rule 2: Move numbers to front and add '0' at the end
    else if (isNumberWithoutZero(s[i])) {
      encryptedPassword = [s[i], ...encryptedPassword, "0"];
    }
    // Rule 3: Keep other characters as is
    else {
      encryptedPassword.push(s[i]);
    }
  }

  return encryptedPassword.join("");
}

function test() {
  const passwords = ["h4ck3rr4nk", "J3ffRoB3rt", "h3lloWorld"];

  for (let p of passwords) {
    const encryptedPassword = encryptPassword(p);
    const decryptedPassword = decryptPassword(encryptedPassword);
    console.log(
      "Password:",
      p,
      " --- Encrypted Password: ",
      encryptedPassword,
      " --- Decrypted Password: ",
      decryptedPassword,
      " Test result: ",
      decryptedPassword === p ? "PASSED" : "FAILED"
    );
  }
}

test();
