-- Table: customers
-- Column: customer_id, name, country, phone_number

-- Table: country_codes
-- Column: country_code, country

-- write a query to return customer_id, name, and formatted phone number of the customers in the following format: +<country_code><phone_number>

SELECT
    c.customer_id,
    c.name,
    CONCAT('+', cc.country_code,  c.phone_number) as phone_number
FROM customers c
JOIN country_codes cc ON c.country = cc.country_code
ORDER BY c.customer_id;