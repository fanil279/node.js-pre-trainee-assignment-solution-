/*
Task 04 – Creating the "users" Table and Altering the "todos" Table

Description
-----------

I connected to the existing `todo_app` database using MySQL Workbench. I created the
`users` table with the required columns and constraints. Then, I altered the existing
`todos` table by adding the `user_id` column and creating a foreign key constraint
referencing `users(id)`. I also configured cascading actions for updates and deletes
on the foreign key relationship.

Terminal Commands
-----------------

No terminal commands were used. I interacted with the database using MySQL Workbench.


SQL Queries
-----------
*/

USE todo_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_name_not_empty
        CHECK (TRIM(name) <> '')
);

ALTER TABLE todos
ADD COLUMN user_id INT;

ALTER TABLE todos
ADD CONSTRAINT fk_todos_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;


/*
Issues Encountered
------------------

While working on the assignment, I initially misunderstood the task order and created
the users table and foreign key before reaching Task 4. After reviewing the
requirements, I recreated the database and completed the previous tasks again
so that the implementation matched the intended progression of the assignment.
*/
