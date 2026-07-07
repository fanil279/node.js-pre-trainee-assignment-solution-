/*
Task 09 – Creating an Audit Log and Triggers

Commits
----------------------

Commit:
- 

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

DELIMITER $$

CREATE TRIGGER after_todo_update
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
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
not exist in the `todos` table, such as an `action` column. After reviewing how
`OLD` and `NEW` records work in MySQL triggers, I corrected the implementation
to insert the todo ID and the appropriate action value into the `audit_log`
table.
*/
