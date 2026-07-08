/*
Task 08 – Perform CRUD Operations with TypeORM

Commits
----------------------

Commit:
- 

Description
-----------

I implemented CRUD operations for the `TodoEntity` using TypeORM repositories.

* A `TodoService` class responsible for database operations.
* Creating new todos using `Repository.create()` and `Repository.save()`.
* Retrieving all todos using `Repository.find()`.
* Updating existing todos using `Repository.findOneBy()`, `Repository.merge()`, and `Repository.save()`.
* Deleting todos using `Repository.delete()`.
* Validation to ensure a referenced user exists before creating a todo.


Issues Encountered
------------------

I attempted to assign a numeric `userId` directly to the `user` relation. This was resolved
by loading the corresponding `UserEntity` from the database before creating the todo.
*/
