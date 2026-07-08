/*
Task 10 – Caching the User's Todo List with Redis

Commits
----------------------

Commit:
- 

Description
-----------

I implemented Redis caching for the user's todo list using the cache-aside pattern.

* Configured a Redis client using the `ioredis` library.
* Added a `findAllByUserId()` method that first checks Redis for cached todos.
* On a cache hit, returns the cached data without querying the database.
* On a cache miss, retrieves the user's todos from MySQL using TypeORM, stores the result in Redis with a TTL of 5 minutes, and returns the data.
* Implemented manual cache invalidation by deleting the corresponding Redis key whenever a todo is created, updated, or deleted.
* Used user-specific cache keys in the format `todos:user:{userId}` to cache each user's todo list independently.


Issues Encountered
------------------

Initially, I cached all todos under a single Redis key instead of caching each user's todo list separately.
I updated the implementation to use user-specific cache keys as required by the assignment.
*/
