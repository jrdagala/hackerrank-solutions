-- Table: CITY
-- Columns: ID (number), NAME (varchar2(17)), COUNTRYCODE (varchar2(3)), DISTRICT (varchar2(20)), POPULATION (number)

-- Problem: Query the NAME for all American Cities in the CITY table with population larger than 120000. The CountryCode

/*
    Enter your query here and follow these instructions:
    1. Please append a semicolon ";" at the end of the query and enter your query in a single line to avoid error.
    2. The AS keyword causes errors, so follow this convention: "Select t.Field From table1 t" instead of "select t.Field From table1 AS t"
    3. Type your code immediately after comment. Don't leave any blank line.
*/

SELECT NAME FROM CITY WHERE POPULATION > 120000 AND COUNTRYCODE = 'USA';