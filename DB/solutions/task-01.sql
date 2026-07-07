/* Task 01 – Setting Up and Creating the "users" and "todos" Tables with Raw SQL

Description
-----------

I already had MySQL Server and MySQL Workbench installed, so no installation was required.
I connected to my local MySQL server using MySQL Workbench, created a new database named `todo_app`,
selected it as the active database, and created the `todos` table using raw SQL.

Terminal Commands
-----------------

No terminal commands were used because MySQL Server and MySQL Workbench were already installed on my machine.


SQL Queries
-----------
*/

CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status ENUM('active', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    
    CONSTRAINT chk_title_not_empty
        CHECK (TRIM(title) <> '')
);


/*
Issues Encountered
------------------

No issues were encountered during the setup.
*/
