/* Task 01 – Setting Up and Creating the "users" and "todos" Tables with Raw SQL

Description
-----------

I already had MySQL Server and MySQL Workbench installed, so no installation was required.
I connected to my local MySQL server using MySQL Workbench, created a new database named `todo_app`,
selected it as the active database, and created the `users` and `todos` tables using raw SQL.
The `todos` table includes a foreign key referencing the `users` table, along with a CHECK constraint to prevent empty todo titles.

Terminal Commands
-----------------

No terminal commands were used because MySQL Server and MySQL Workbench were already installed on my machine.


SQL Queries
-----------
*/

CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    status ENUM('active', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,

    CONSTRAINT fk_todos_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	CONSTRAINT chk_title_not_empty
		CHECK(TRIM(title) <> '')
);


/*
Issues Encountered
------------------

No issues were encountered during the setup.
*/
