/*
Task 05 – Aggregate Queries and Table Relationships with Raw SQL

Description
-----------

I connected to the existing `todo_app` database using MySQL Workbench and executed
aggregate SQL queries to analyze the data stored in the database. I counted the
number of todos for each status, counted the number of todos assigned to each user
using an `INNER JOIN`, and identified users without any assigned todos using a
`LEFT JOIN`.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

SELECT
    status,
    COUNT(*) AS total_todos
FROM todos
GROUP BY status;

SELECT
    u.name,
    COUNT(t.id) AS todos_count
FROM users AS u
INNER JOIN todos AS t
    ON u.id = t.user_id
GROUP BY u.id, u.name;

SELECT
    u.name
FROM users AS u
LEFT JOIN todos AS t
    ON u.id = t.user_id
WHERE t.id IS NULL;


/*
Issues Encountered
------------------

No issues were encountered while executing the aggregate and join queries.
*/
