/*
Task 03 – Filtering, Sorting, and Searching Data with Raw SQL

Description
-----------

I connected to the existing `todo_app` database using MySQL Workbench and executed
SQL queries to filter todos by status, sort them by their creation date in both
ascending and descending order, and search for todos whose title or description
contains a specific keyword.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

SELECT *
FROM todos
WHERE status = 'active';

SELECT *
FROM todos
WHERE status = 'completed';

SELECT *
FROM todos
ORDER BY created_at ASC;

SELECT *
FROM todos
ORDER BY created_at DESC;

SELECT *
FROM todos
WHERE title LIKE '%bread%'
   OR description LIKE '%store%';


/*
Issues Encountered
------------------

No issues were encountered while executing the filtering, sorting, and searching
queries.
*/
