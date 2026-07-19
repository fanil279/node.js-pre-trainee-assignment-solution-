/*
Task 06 – Creating an Index and Analyzing Query Performance

Description
-----------

I connected to the existing `todo_app` database using MySQL Workbench and created an
index on the `status` column of the `todos` table. After creating the index, I used
`EXPLAIN ANALYZE` to examine the execution plan of a query that filters todos by
their status and to verify that MySQL used the newly created index.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

CREATE INDEX idx_status
ON todos(status);

EXPLAIN ANALYZE
SELECT *
FROM todos
WHERE status = 'active';


/*
Issues Encountered
------------------

No issues were encountered while creating the index and analyzing the query execution plan.
However, I first had to learn what is EXPLAIN ANALYZE as I had not worked with it before. 
*/
