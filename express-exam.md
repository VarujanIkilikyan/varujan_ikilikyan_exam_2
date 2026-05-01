# 📝 Exam: Build a Book Library REST API with Express.js

**Course:** Node.js & Express.js  
**Duration:** 3 hours  
**Total Points:** 100

---

## Overview

Your task is to build a **Book Library REST API** using Express.js. Your application must follow the **MVC pattern** (Models, Controllers, Routes) with middlewares and JSON file storage — the same architecture you learned in class.

The API allows users to **register**, **login**, and manage their personal book collection (add, view, update, delete books). The book listing endpoint must support **pagination**. All data must be stored in JSON files. All responses must be **JSON**.

---

## 📖 What is Pagination?

When your API returns a list of items (e.g. books), the list can grow very large — hundreds or even thousands of items. Sending all items in a single response is **slow and inefficient**. **Pagination** solves this by splitting the data into smaller chunks called **pages**.

### How it works

The client sends two **query parameters** in the URL:

| Parameter | Meaning                              | Example |
|-----------|--------------------------------------|---------|
| `page`    | Which page number to return (starts from 1) | `1`     |
| `limit`   | How many items per page              | `10`    |

**Example request:**
```
GET /books?page=2&limit=5
```

This means: _"Give me page 2, with 5 books per page"_ — so you skip the first 5 books and return books 6 through 10.

### The math behind it

To figure out which items to return, you use two values:

- **`skip`** = how many items to skip = `(page - 1) * limit`
- **`limit`** = how many items to take after skipping

For example, if you have 12 books and the client requests `page=2&limit=5`:

```
skip = (2 - 1) * 5 = 5
limit = 5

All books:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                              ↑ skip 5, then take 5
Result:     [6, 7, 8, 9, 10]
```

### In JavaScript, you can use `.slice()`:

```js
const page = 2;
const limit = 5;
const skip = (page - 1) * limit;

const paginatedBooks = allBooks.slice(skip, skip + limit);
```

### What your API should return

Along with the paginated items, your API must return **metadata** so the client knows about the total data and can navigate between pages:

```json
{
  "books": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

| Field        | Meaning                                            |
|-------------|----------------------------------------------------|
| `page`      | The current page number                             |
| `limit`     | How many items per page                             |
| `total`     | Total number of items in the database               |
| `totalPages`| Total number of pages = `Math.ceil(total / limit)`  |

### Default values

If the client doesn't send `page` or `limit`, you should use **default values**:
- `page` defaults to `1`
- `limit` defaults to `10`

### Reading query parameters in Express

In Express, query parameters from the URL are available in `req.query`:

```
GET /books?page=2&limit=5
```

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
```

> **Note:** `req.query.page` is always a **string**, so you need to convert it to a number using `parseInt()`. The `|| 1` part sets the default value if the parameter is missing or invalid.

---


## Project Structure

```
book-library/
├── app.js
├── .env
├── .gitignore
├── package.json
├── data/
│   ├── users.json
│   └── books.json
├── controllers/
│   ├── auth.js
│   └── books.js
├── models/
│   ├── users.js
│   └── books.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   └── books.js
└── middlewares/
    ├── authorization.js
    ├── errorHandler.js
    ├── validation.js
    └── schemas/
        ├── auth.schema.js
        └── books.schema.js
```

---

## Step 1: Project Setup (5 points)

### 1.1 Initialize your project

- Create a `package.json` with `"type": "module"` for ES module support
- Add a `"dev"` script that uses `nodemon` to run the app

### 1.2 Install dependencies

You need to install the following packages:

| Package      | Purpose                     |
|-------------|-----------------------------|
| `express`   | Web framework               |
| `dotenv`    | Load environment variables  |
| `morgan`    | HTTP request logger         |
| `uuid`      | Generate unique IDs         |
| `md5`       | Password hashing            |
| `crypto-js` | Token encryption/decryption |
| `joi`       | Request validation          |
| `http-errors` | HTTP error creation       |
| `lodash`    | Utility functions           |
| `nodemon`   | Dev server (devDependency)  |

### 1.3 Create your `.env` file

```
PORT=4000
PASSWORD_SECRET=your_password_secret_here
TOKEN_SECRET=your_token_secret_here
```

### 1.4 Create a `.gitignore`

```
node_modules
.env
```

---

## Step 2: `app.js` — Application Entry Point (10 points)

Create your main application file. It should:

1. Import `dotenv/config` at the top
2. Import `path`, `morgan`, `express`, and `createServer` from `http`
3. Import the main router from `./routes/index.js`
4. Import the error handler from `./middlewares/errorHandler.js`
5. Create an Express app
6. Read `PORT` from `process.env`
7. Register **middlewares** in this order:
   - `morgan('dev')` — for logging
   - `express.json()` — for parsing JSON request bodies
   - `express.urlencoded({ extended: false })` — for parsing form data
8. Register the **main router**
9. Register **error handlers**:
   - `errorHandler.notFound`
   - `errorHandler.errors`
10. Create an HTTP server and listen on `PORT`

---

## Step 3: `models/users.js` — User Model (15 points)

This module handles all user data operations. You must use a **JSON file** (`data/users.json`) for storage.

### You need to implement the following functions:

#### `getDataPath(dirPath)`
- Takes a filename and returns the absolute path inside the `data/` folder
- Use `path.resolve()` with `process.cwd()`

#### `readJSON()` (async)
- Reads the users JSON file using `fs.readFile()` with `'utf8'` encoding
- Parses and returns the data
- Returns `[]` if the file doesn't exist (use `try/catch`)

#### `writeJSON(data)` (async)
- Writes data to the users JSON file
- Use `JSON.stringify(data, null, 2)` for formatting
- Use `try/catch`

#### `findById(id)` (async)
- Reads all users and returns the one matching the `id`
- Returns `null` if not found

#### `findByEmail(email)` (async)
- Reads all users and returns the one matching the `email`
- Returns `null` if not found

#### `checkEmailUnique(email)` (async)
- Returns `true` if a user with that email already exists, `false` otherwise

#### `create(data)` (async)
- Reads current users
- Creates a new user object with `id` generated by `uuidV4()`
- Pushes to the array and writes back to file
- Returns the new user

#### `hashPassword(pass)`
- Hashes the password using: `md5(md5(pass) + PASSWORD_SECRET)`
- Returns the hashed string

#### `encrypt(data)`
- Encrypts data using `CryptoJS.AES.encrypt(JSON.stringify(data), TOKEN_SECRET)`
- Returns the encrypted string

#### `decrypt(ciphertext)`
- Decrypts the ciphertext using `CryptoJS.AES.decrypt()`
- Parses the result with `JSON.parse()`
- Returns the data object, or `null` on failure (use `try/catch`)

You must export all functions as both **named exports** and a **default object**.

---

## Step 4: `models/books.js` — Book Model (15 points)

This module handles all book data operations. You must use a **JSON file** (`data/books.json`) for storage.

### You need to implement the following functions:

#### `readJSON()` / `writeJSON(data)` (async)
- Same pattern as the users model but reads/writes `data/books.json`

#### `findAll(userId, page, limit)` (async)
- Filters all books by `userId` using `.filter()`
- Implements **pagination** using `page` and `limit` parameters
- Calculates `skip = (page - 1) * limit`
- Returns a **paginated slice** of the filtered books using `.slice(skip, skip + limit)`
- Also returns the **total count** of the user's books (before slicing)
- Return format: `{ books: [...], total: <number> }`

#### `findById(id)` (async)
- Returns a single book by its `id`, or `null`

#### `create(data)` (async)
- Creates a new book with a `uuid` id
- The `data` should include: `title`, `author`, `year`, `genre`, `userId`
- Writes to file and returns the new book

#### `update(id, userId, data)` (async)
- Finds the book by `id`
- **Only updates if `book.userId === userId`** (ownership check)
- Merges the new data and writes to file
- Returns the updated book, or `null` if not found / not owned

#### `deleteBook(id, userId)` (async)
- Removes the book by `id`
- **Only deletes if `book.userId === userId`** (ownership check)
- Returns `true` if deleted, `false` if not found / not owned

You must export all functions as both **named exports** and a **default object**.

---

## Step 5: Middlewares (20 points)

### 5.1 `middlewares/errorHandler.js` (5 points)

You need to export an object with two methods:

#### `notFound(req, res, next)`
- Creates a `404` HTTP error using `http-errors` and passes it to `next()`

#### `errors(err, req, res, next)`
- Responds with the error's status code (default to `500`)
- Returns JSON: `{ message, errors }`

---

### 5.2 `middlewares/authorization.js` (5 points)

You need to export a middleware function that:

1. Reads the token from `req.headers.authorization`
2. If no token exists → calls `next()` with a `401` HTTP error
3. Decrypts the token using `Users.decrypt(token)`
4. If decryption fails or `userId` is missing → calls `next()` with a `401` HTTP error
5. Sets `req.userId = decryptData.userId`
6. Calls `next()` to continue
7. Wraps everything in `try/catch`

---

### 5.3 `middlewares/validation.js` (5 points)

You need to export a **higher-order function** `validator(schema, path)` that returns a middleware:

1. The function takes a `schema` (Joi schema) and a `path` (default: `'body'`)
2. Validates `req[path]` against the schema with `{ abortEarly: false }`
3. If validation fails:
   - Collect all error messages into an `errors` object using `lodash.set()`
   - Clean up error messages by removing the quoted field name
   - Throw a `422` HTTP error with `{ message: 'Validation error', errors }`
4. If validation passes → call `next()`
5. Use `try/catch`

---

### 5.4 Validation Schemas (5 points)

#### `middlewares/schemas/auth.schema.js`

You need to define the following Joi schemas:

```
register:
  - username: string, alphanumeric, required
  - email: string, valid email, required
  - password: string, min 6, max 32, required
  - age: number, integer, min 16, max 120, required

login:
  - email: string, valid email, required
  - password: string, min 6, max 32, required
```

#### `middlewares/schemas/books.schema.js`

```
create:
  - title: string, min 1, max 200, required
  - author: string, min 1, max 100, required
  - year: number, integer, min 1000, max current year, required
  - genre: string, valid values: ["fiction", "non-fiction", "science", "history", "fantasy", "mystery", "biography", "other"], required

update:
  - title: string, min 1, max 200, required
  - author: string, min 1, max 100, required
  - year: number, integer, min 1000, max current year, required
  - genre: string, valid values (same list), required
```

---

## Step 6: Routes (15 points)

### 6.1 `routes/index.js` (5 points)

1. Create a main `Router`
2. Define a `GET /` route that returns JSON: `{ message: "Welcome to the Book Library API" }`
3. Mount `authRouter` at `/auth`
4. Mount `booksRouter` at `/books`
5. Export the router

---

### 6.2 `routes/auth.js` (5 points)

| Method | Path        | Middleware                             | Controller            |
|--------|-------------|----------------------------------------|-----------------------|
| POST   | `/register` | `validation(schema.register, 'body')`  | `controller.register` |
| POST   | `/login`    | `validation(schema.login, 'body')`     | `controller.login`    |
| GET    | `/profile`  | `authorization`                        | `controller.profile`  |

---

### 6.3 `routes/books.js` (5 points)

**All book routes must use the `authorization` middleware.**

| Method | Path   | Middleware                                          | Controller           |
|--------|--------|-----------------------------------------------------|----------------------|
| GET    | `/`    | `authorization`                                     | `controller.getAll`  |
| POST   | `/`    | `authorization`, `validation(schema.create, 'body')`| `controller.create`  |
| PUT    | `/:id` | `authorization`, `validation(schema.update, 'body')`| `controller.update`  |
| DELETE | `/:id` | `authorization`                                     | `controller.delete`  |

---

## Step 7: Controllers (20 points)

### 7.1 `controllers/auth.js` (10 points)

#### `register(req, res, next)`
1. Extract `username`, `email`, `password`, `age` from `req.body`
2. Check if the email is already in use using `Users.checkEmailUnique(email)`
3. If the email exists → throw a `422` error with message `"Email is already in use!"`
4. Create the user with a **hashed password** using `Users.hashPassword(password)`
5. Delete `password` from the user object before responding
6. Respond with `{ message: "User registered successfully", user }`

#### `login(req, res, next)`
1. Extract `email`, `password` from `req.body`
2. Find the user by email using `Users.findByEmail(email)`
3. If the user is not found OR the password doesn't match the hashed password → throw a `401` error
4. Create a token by encrypting `{ userId: user.id }`
5. Delete `password` from the user object
6. Respond with `{ token, user }`

#### `profile(req, res, next)`
1. Find the user by `req.userId` using `Users.findById()`
2. Respond with `{ user }`

**All your methods must use `try/catch` and call `next(e)` on errors.**

---

### 7.2 `controllers/books.js` (10 points)

#### `getAll(req, res, next)`
1. Read `page` and `limit` from `req.query`
2. Convert them to numbers using `parseInt()`, use defaults: `page = 1`, `limit = 10`
3. Call `Books.findAll(req.userId, page, limit)`
4. Calculate `totalPages = Math.ceil(total / limit)`
5. Respond with:
```json
{
  "books": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```


#### `create(req, res, next)`
1. Extract `title`, `author`, `year`, `genre` from `req.body`
2. Create a new book with `userId: req.userId`
3. Respond with `{ message: "Book added successfully", book }`

#### `update(req, res, next)`
1. Get `id` from `req.params.id`
2. Extract `title`, `author`, `year`, `genre` from `req.body`
3. Call `Books.update(id, req.userId, { title, author, year, genre })`
4. If `null` is returned → throw a `404` error with message `"Book not found"`
5. Respond with `{ message: "Book updated successfully", book }`

#### `delete(req, res, next)`
1. Get `id` from `req.params.id`
2. Call `Books.deleteBook(id, req.userId)`
3. If `false` is returned → throw a `404` error with message `"Book not found"`
4. Respond with `{ message: "Book deleted successfully" }`

**All your methods must use `try/catch` and call `next(e)` on errors.**

---

## Data Files

### `data/users.json`

Start with an empty array:
```json
[]
```

### `data/books.json`

Start with an empty array:
```json
[]
```

---

## API Endpoints Summary

| Method | Endpoint         | Auth? | Description              |
|--------|-----------------|-------|--------------------------|
| GET    | `/`             | ❌    | Welcome message          |
| POST   | `/auth/register`| ❌    | Register a new user      |
| POST   | `/auth/login`   | ❌    | Login and get token      |
| GET    | `/auth/profile` | ✅    | Get current user profile |
| GET    | `/books?page=1&limit=10` | ✅ | Get user's books (paginated) |
| POST   | `/books`        | ✅    | Add a new book           |
| PUT    | `/books/:id`    | ✅    | Update a book            |
| DELETE | `/books/:id`    | ✅    | Delete a book            |

---

## Grading Criteria

| Section                                        | Points |
|------------------------------------------------|--------|
| Project Setup & `app.js`                       | 10     |
| User Model (`models/users.js`)                 | 15     |
| Book Model (`models/books.js`) incl. pagination| 15     |
| Middlewares (error, auth, validation, schemas)  | 20     |
| Routes                                         | 10     |
| Controllers incl. pagination in `getAll`       | 20     |
| Pagination (correct response format & defaults)| 10     |
| **Total**                                      | **100** |



---

## Requirements Checklist

Make sure your project meets all of the following:

- [ ] Uses ES module syntax (`import`/`export`)
- [ ] Follows MVC architecture (models, controllers, routes)
- [ ] Routes are organized in separate files
- [ ] Validation uses Joi schemas via a reusable middleware
- [ ] Passwords are hashed with `md5` + secret
- [ ] Tokens are encrypted/decrypted with `crypto-js`
- [ ] Authorization middleware protects private routes
- [ ] Error handler catches 404s and formats all errors as JSON
- [ ] Data persists in JSON files between server restarts
- [ ] Books belong to users (ownership check on update/delete)
- [ ] `GET /books` supports pagination with `page` and `limit` query parameters
- [ ] Pagination uses default values (`page=1`, `limit=10`) when not provided
- [ ] Pagination response includes `books`, `page`, `limit`, `total`, and `totalPages`
- [ ] All async code uses `async/await` with `try/catch`
- [ ] Code is clean and has meaningful comments

---

## How to Test Your Work

1. Run `npm run dev` (or `yarn dev`)
2. Use **Postman** or **Thunder Client** to test your API:

### Follow this test flow:

```
1. POST /auth/register
   Body: { "username": "john", "email": "john@mail.com", "password": "123456", "age": 25 }
   → You should get back a user object (without password)

2. POST /auth/login
   Body: { "email": "john@mail.com", "password": "123456" }
   → You should get back a token + user object

3. GET /auth/profile
   Header: Authorization: <token from login>
   → You should get back your user profile

4. POST /books
   Header: Authorization: <token>
   Body: { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925, "genre": "fiction" }
   → You should get back the created book

5. GET /books
   Header: Authorization: <token>
   → You should get back an array of your books

6. PUT /books/:id
   Header: Authorization: <token>
   Body: { "title": "Updated Title", "author": "Updated Author", "year": 2020, "genre": "mystery" }
   → You should get back the updated book

7. DELETE /books/:id
   Header: Authorization: <token>
   → You should get back a success message
```

3. Restart the server — all your data should still be there
4. Check `data/users.json` and `data/books.json` to verify your stored data

---

## Submission

Submit your entire `book-library/` folder with all files listed in the project structure.

---

Good luck! 📚
