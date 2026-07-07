/*
Task 07 – Connecting the Todo Project to a Database Using TypeORM

Commit Hash
-----------

- a326b00

Description
-----------

I initialized a Node.js and TypeScript project and installed TypeORM along with the
required MySQL driver. I configured a DataSource to connect to the existing
`todo_app` database using environment variables.

I created `UserEntity` and `TodoEntity` with the appropriate columns and a one-to-many /
many-to-one relationship between users and todos. I then generated and executed a
TypeORM migration to create the database schema.

Finally, I implemented a seed script that inserts two users and three todos for each
user using TypeORM repositories and cascading inserts.


Issues Encountered
------------------

While I did not encounter major problems with doing task 7, I still had to read some documentation
in order to understnd how TypeORM migration work.
