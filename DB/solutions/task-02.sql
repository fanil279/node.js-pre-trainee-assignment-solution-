/*
Task 02 – Basic CRUD Operations on the "todos" Table with Raw SQL

Description
-----------

I connected to the existing `todo_app` database using MySQL Workbench and performed
the four basic CRUD operations on the `todos` table using raw SQL. Since the `todos`
table has a foreign key referencing the `users` table, I first inserted a user record
before creating a todo associated with that user.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

-- User is inserted because todos.user_id is a foreign key referencing users.id
INSERT INTO users (username, email, password_hash)
VALUES (
    'luis',
    'luis@example.com',
    'hashed_password'
);

INSERT INTO todos (title, description, status, user_id)
VALUES (
    'Buy bread',
    'In the nearest store',
    'active',
    1
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

During the implementation, I initially tried to insert a todo before creating a
corresponding user. Since the todos.user_id column is a foreign key referencing
users.id, MySQL rejected the insert due to the foreign key constraint. After inserting
a user first, I was able to create the todo successfully.
*/
