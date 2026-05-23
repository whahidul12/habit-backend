# 📖 GLOSSARY OF TERMS

A comprehensive glossary of technical terms used throughout the documentation.

---

## A

**API (Application Programming Interface)**  
A set of rules and protocols that allows different software applications to communicate with each other. Your backend provides a REST API that the frontend uses.

**Async/Await**  
JavaScript syntax for handling asynchronous operations. Makes asynchronous code look and behave like synchronous code.

```javascript
const data = await fetchData(); // Waits for fetchData to complete
```

**Authentication**  
The process of verifying who a user is (usually with email/password).

**Authorization**  
The process of verifying what a user is allowed to do (permissions).

---

## B

**Backend**  
The server-side of an application. Handles business logic, database operations, and API endpoints.

**bcrypt**  
A library for hashing passwords. Makes passwords secure by converting them into irreversible hashes.

**Body Parser**  
Middleware that parses incoming request bodies (like JSON data) and makes it available in `req.body`.

---

## C

**CORS (Cross-Origin Resource Sharing)**  
A security feature that allows or restricts web pages from making requests to a different domain than the one serving the page.

**Controller**  
A function that handles business logic for a specific route. Processes requests and returns responses.

**CRUD**  
Create, Read, Update, Delete - the four basic operations for managing data.

---

## D

**Database**  
A structured collection of data. Your app uses MongoDB, a NoSQL database.

**Dependency**  
An external package or library that your project needs to function (listed in package.json).

**Document**  
In MongoDB, a single record in a collection (similar to a row in SQL databases).

---

## E

**Endpoint**  
A specific URL path in your API (e.g., `/api/habits`).

**Environment Variable**  
Configuration values stored outside your code (in `.env` file). Used for secrets and environment-specific settings.

**Express**  
A minimal and flexible Node.js web application framework. The foundation of your backend.

---

## F

**Frontend**  
The client-side of an application. What users see and interact with (your React app).

**Function**  
A reusable block of code that performs a specific task.

---

## G

**GET Request**  
An HTTP method used to retrieve data from a server.

**Gemini**  
Google's AI model used for generating insights and suggestions in your app.

---

## H

**Hash**  
A one-way cryptographic function that converts data into a fixed-size string. Used for passwords.

**HTTP (Hypertext Transfer Protocol)**  
The protocol used for communication between clients and servers on the web.

**HTTP Status Code**  
A three-digit number that indicates the result of an HTTP request (200 = success, 404 = not found, etc.).

---

## I

**Index**  
A database optimization that speeds up queries on specific fields.

**Import/Export**  
ES6 syntax for including code from other files.

```javascript
import express from "express"; // Import
export const myFunction = () => {}; // Export
```

---

## J

**JSON (JavaScript Object Notation)**  
A lightweight data format for storing and transporting data.

```json
{ "name": "John", "age": 30 }
```

**JWT (JSON Web Token)**  
A secure way to transmit information between parties as a JSON object. Used for authentication.

---

## K

**Key-Value Pair**  
A data structure where each key is associated with a value.

```javascript
{
  key: "value";
}
```

---

## L

**Localhost**  
Your own computer when used as a server (usually `http://localhost:8000`).

**Log**  
A record of an event or action (in your app, a habit completion record).

---

## M

**Middleware**  
Functions that execute during the request-response cycle. Can modify requests, responses, or terminate the cycle.

**Model**  
A representation of data structure in your application. Defines how data is stored in the database.

**MongoDB**  
A NoSQL database that stores data in flexible, JSON-like documents.

**Mongoose**  
An ODM (Object Data Modeling) library for MongoDB and Node.js. Provides schema-based data modeling.

**MVC (Model-View-Controller)**  
A design pattern that separates application logic into three interconnected components.

---

## N

**Node.js**  
A JavaScript runtime that allows you to run JavaScript on the server (not just in browsers).

**NoSQL**  
A type of database that doesn't use traditional table-based relational structure (like MongoDB).

**npm/pnpm**  
Package managers for Node.js. Used to install and manage dependencies.

---

## O

**ODM (Object Data Modeling)**  
A programming technique for converting data between incompatible type systems (like Mongoose for MongoDB).

**ObjectId**  
MongoDB's unique identifier type. A 12-byte identifier typically represented as a 24-character hexadecimal string.

---

## P

**Package**  
A reusable piece of code that can be installed and used in your project.

**Payload**  
The actual data being transmitted in a request or response.

**POST Request**  
An HTTP method used to send data to a server to create a resource.

**Promise**  
A JavaScript object representing the eventual completion or failure of an asynchronous operation.

**Protected Route**  
An API endpoint that requires authentication to access.

---

## Q

**Query**  
A request for data from a database.

**Query Parameter**  
Data passed in the URL after a `?` (e.g., `/api/habits?category=Health`).

---

## R

**REST (Representational State Transfer)**  
An architectural style for designing networked applications. Uses HTTP methods (GET, POST, PUT, DELETE).

**Route**  
A definition of how an application responds to a client request to a particular endpoint.

**Router**  
An Express object that handles routing for a specific path prefix.

---

## S

**Schema**  
A blueprint that defines the structure of data in a database.

**Seed**  
To populate a database with initial or test data.

**Server**  
A computer or program that provides functionality to other programs or devices (clients).

**Session**  
A way to store user data across multiple requests.

**Status Code**  
See HTTP Status Code.

---

## T

**Token**  
A piece of data that represents authentication credentials (like a JWT).

**Try-Catch**  
A JavaScript construct for handling errors.

```javascript
try {
  // Code that might throw an error
} catch (err) {
  // Handle the error
}
```

---

## U

**URI (Uniform Resource Identifier)**  
A string that identifies a resource (like a database connection string).

**URL (Uniform Resource Locator)**  
A reference to a web resource (like `http://localhost:8000/api/habits`).

**Utility Function**  
A helper function that performs a common task (like date formatting).

---

## V

**Validation**  
The process of checking if data meets certain criteria before processing it.

**Variable**  
A named storage location for data.

---

## W

**Webhook**  
An HTTP callback that occurs when something happens (not used in your current app).

---

## Common Acronyms

| Acronym  | Full Form                         | Meaning                                    |
| -------- | --------------------------------- | ------------------------------------------ |
| **API**  | Application Programming Interface | Interface for software communication       |
| **CORS** | Cross-Origin Resource Sharing     | Security feature for cross-domain requests |
| **CRUD** | Create, Read, Update, Delete      | Basic data operations                      |
| **HTTP** | Hypertext Transfer Protocol       | Web communication protocol                 |
| **JSON** | JavaScript Object Notation        | Data format                                |
| **JWT**  | JSON Web Token                    | Authentication token format                |
| **MVC**  | Model-View-Controller             | Design pattern                             |
| **ODM**  | Object Data Modeling              | Database abstraction layer                 |
| **REST** | Representational State Transfer   | API architectural style                    |
| **URI**  | Uniform Resource Identifier       | Resource identifier                        |
| **URL**  | Uniform Resource Locator          | Web address                                |

---

## HTTP Methods

| Method     | Purpose               | Example                |
| ---------- | --------------------- | ---------------------- |
| **GET**    | Retrieve data         | Get all habits         |
| **POST**   | Create new data       | Create a habit         |
| **PUT**    | Update existing data  | Update a habit         |
| **DELETE** | Delete data           | Delete a habit         |
| **PATCH**  | Partially update data | Update habit name only |

---

## HTTP Status Codes

| Code    | Name                  | Meaning                       |
| ------- | --------------------- | ----------------------------- |
| **200** | OK                    | Request succeeded             |
| **201** | Created               | Resource created successfully |
| **400** | Bad Request           | Invalid request data          |
| **401** | Unauthorized          | Authentication required       |
| **403** | Forbidden             | No permission to access       |
| **404** | Not Found             | Resource doesn't exist        |
| **500** | Internal Server Error | Server error occurred         |

---

## MongoDB Terms

| Term           | Meaning                                               |
| -------------- | ----------------------------------------------------- |
| **Collection** | A group of documents (like a table in SQL)            |
| **Document**   | A single record (like a row in SQL)                   |
| **Field**      | A key-value pair in a document (like a column in SQL) |
| **ObjectId**   | Unique identifier for documents                       |
| **Query**      | Request for data from the database                    |
| **Index**      | Data structure for faster queries                     |

---

## Express Terms

| Term           | Meaning                                     |
| -------------- | ------------------------------------------- |
| **app**        | The Express application instance            |
| **req**        | Request object (contains request data)      |
| **res**        | Response object (used to send responses)    |
| **next**       | Function to pass control to next middleware |
| **router**     | Mini-application for handling routes        |
| **middleware** | Function that processes requests            |

---

## Mongoose Terms

| Term           | Meaning                                   |
| -------------- | ----------------------------------------- |
| **Schema**     | Blueprint for document structure          |
| **Model**      | Compiled schema, used to create documents |
| **Document**   | Instance of a model                       |
| **Query**      | Mongoose operation to retrieve data       |
| **Populate**   | Replace references with actual documents  |
| **Validation** | Checking data against schema rules        |

---

## Authentication Terms

| Term       | Meaning                                   |
| ---------- | ----------------------------------------- |
| **Token**  | Credential for authentication             |
| **JWT**    | JSON Web Token format                     |
| **Bearer** | Token type prefix in Authorization header |
| **Hash**   | One-way encrypted password                |
| **Salt**   | Random data added before hashing          |
| **Secret** | Key used to sign/verify tokens            |

---

## Code Patterns

### Async Function

```javascript
async function myFunction() {
  const data = await fetchData();
  return data;
}
```

### Arrow Function

```javascript
const myFunction = () => {
  return "Hello";
};
```

### Destructuring

```javascript
const { name, email } = req.body;
// Instead of: const name = req.body.name;
```

### Template Literal

```javascript
const message = `Hello ${name}`;
// Instead of: "Hello " + name
```

### Spread Operator

```javascript
const newObj = { ...oldObj, newField: "value" };
```

---

## File Extensions

| Extension | Type        | Purpose                  |
| --------- | ----------- | ------------------------ |
| **.js**   | JavaScript  | Code files               |
| **.json** | JSON        | Configuration/data files |
| **.md**   | Markdown    | Documentation files      |
| **.env**  | Environment | Environment variables    |
| **.yaml** | YAML        | Configuration files      |

---

## Common Commands

```bash
# Package management
pnpm install          # Install dependencies
pnpm add package      # Add new package
pnpm run dev          # Run development server

# Git
git add .             # Stage changes
git commit -m "msg"   # Commit changes
git push              # Push to remote

# Node.js
node file.js          # Run JavaScript file
npm start             # Run start script
```

---

## Symbols & Operators

| Symbol | Name             | Meaning                      |
| ------ | ---------------- | ---------------------------- |
| `=>`   | Arrow            | Arrow function               |
| `...`  | Spread           | Spread operator              |
| `$`    | Dollar           | Template literal variable    |
| `?`    | Question         | Optional chaining or ternary |
| `!`    | Exclamation      | NOT operator                 |
| `&&`   | Double ampersand | AND operator                 |
| `\|\|` | Double pipe      | OR operator                  |
| `===`  | Triple equals    | Strict equality              |
| `!==`  | Not equals       | Strict inequality            |

---

## Naming Conventions

| Convention     | Example       | Used For             |
| -------------- | ------------- | -------------------- |
| **camelCase**  | `myVariable`  | Variables, functions |
| **PascalCase** | `MyClass`     | Classes, models      |
| **kebab-case** | `my-file.js`  | File names           |
| **UPPER_CASE** | `MY_CONSTANT` | Constants            |
| **snake_case** | `my_variable` | Rarely used in JS    |

---

## Related Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference
- [Express Documentation](https://expressjs.com/) - Express guide
- [Mongoose Documentation](https://mongoosejs.com/) - Mongoose guide
- [MongoDB Documentation](https://docs.mongodb.com/) - MongoDB guide

---

**Need more definitions?** Check the relevant PART documents for detailed explanations with examples.
