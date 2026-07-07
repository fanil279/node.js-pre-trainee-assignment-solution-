/*
Task 02 – Basic CRUD Operations on the "todos" Table with Raw SQL

Description
-----------

I connected to the existing todo_app database using MySQL Workbench and performed the four
basic CRUD operations on the todos table using raw SQL. I inserted a new todo, retrieved all todos,
updated the status of a specific todo, and then deleted it.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

INSERT INTO todos (title, description, status)
VALUES (
    'Buy bread',
    'In the nearest store',
    'active'
);

SELECT * FROM todos;

UPDATE todos
SET status = 'completed'
WHERE id = 1;

DELETE FROM todos
WHERE id = 1;


/*
Issues Encountered
------------------

No issues were encountered during the setup.
*/
