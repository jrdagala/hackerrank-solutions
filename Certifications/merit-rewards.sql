-- Table: employee_information
-- Column: employee_id, name, division

-- Table: last_quarter_bonus
-- Column: employee_id, bonus

-- Problem Summary: 
-- Write a query to find the employees who have received the last quarter bonus greater than 5000 from HR division.

SELECT 
    ei.employee_ID, ei.name 
FROM employee_information ei
JOIN last_quarter_bonus lqb ON ei.employee_id = lqb.employee_id
WHERE lqb.bonus >= 5000 AND ei.division = 'HR';