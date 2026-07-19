/*
Task 09 – Creating an Audit Log and Triggers

Commits
----------------------

Commit:
- 1c2d18e

Description
-----------

I created an `audit_log` table to store information about changes made to the
`todos` table. Then, I implemented two triggers: one that automatically records
an `UPDATE` action whenever a todo is updated, and another that records a
`DELETE` action whenever a todo is deleted. Each audit record stores the todo ID,
the type of action performed, and the timestamp of the change.


SQL Queries
-----------

*/
USE todo_app;

CREATE TABLE audit_log (
	id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT NOT NULL,
    action ENUM('UPDATE', 'DELETE') NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DELIMITER $$ changes the standard statement terminator from a semicolon (;) to $$.
-- This prevents the database from prematurely executing the query when it hits 
-- the semicolons inside the BEGIN/END block, allowing the entire trigger to compile as one unit.
DELIMITER $$

CREATE TRIGGER after_todo_update
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
    -- NEW represents the row data AFTER the change. 
    -- It captures the newly updated column values (e.g., the current ID).
    INSERT INTO audit_log (todo_id, action)
    VALUES (
		NEW.id,
        'UPDATE'
    );
END$$

CREATE TRIGGER after_todo_delete
AFTER DELETE ON todos
FOR EACH ROW
BEGIN
    -- OLD represents the row data BEFORE the change.
    -- Since the row no longer exists after a delete, OLD is required to reference its historical values.
    INSERT INTO audit_log (todo_id, action)
    VALUES (
		OLD.id,
        'DELETE'
    );
END$$

DELIMITER ;


/*
Issues Encountered
------------------

While implementing the triggers, I initially attempted to insert values that did
not exist in the `todos` table, such as an `action` column like OLD.action. After reviewing how
`OLD` and `NEW` records work in MySQL triggers, I corrected the implementation
to insert the todo ID and the appropriate action value into the `audit_log`
table.
*/
