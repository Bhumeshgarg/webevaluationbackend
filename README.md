# Backend Web Development Tutorial: Node.js, Express & MongoDB

This repository contains the complete, production-ready implementation of the **Intro to Backend Web Development** tutorial (freeCodeCamp / Shivani / Hack Club). It covers the full lifecycle of building a RESTful API backend using **Node.js**, **Express.js**, and **MongoDB Atlas** with **Mongoose ODM**.

---

## 📑 Table of Contents

1. [Architecture & Project Structure](#architecture--project-structure)
2. [Prerequisites](#prerequisites)
3. [Step (a): Node Project Setup & Git / GitHub](#step-a-node-project-setup--git--github)
4. [Step (b): Setting Up Online MongoDB Atlas Cluster](#step-b-setting-up-online-mongodb-atlas-cluster)
5. [Step (c): Creating MongoDB Database Models](#step-c-creating-mongodb-database-models)
6. [Step (d): Express REST APIs & Controllers (CRUD & Auth)](#step-d-express-rest-apis--controllers-crud--auth)
7. [Step (e): Testing APIs with Postman Desktop](#step-e-testing-apis-with-postman-desktop)
8. [Running the Application on Your Laptop](#running-the-application-on-your-laptop)
9. [Evaluation & Submission Checklist](#evaluation--submission-checklist)

---

## 🏗 Architecture & Project Structure

This project follows the industry-standard **Model-Route-Controller (MRC)** design pattern to ensure clean separation of concerns:

```
backend-tutorial/
│
├── controllers/
│   ├── post.controller.js     # Business logic for Post CRUD operations
│   └── user.controller.js     # Business logic for Registration, Login, Logout
│
├── models/
│   ├── post.model.js          # Mongoose Schema & Model for Posts
│   └── user.model.js          # Mongoose Schema & Model for Users
│
├── routes/
│   ├── post.routes.js         # Express routing for /api/posts endpoints
│   └── user.routes.js         # Express routing for /api/users endpoints
│
├── .env                       # Local environment variables (kept private)
├── .env.example               # Template environment file for git repository
├── .gitignore                 # Files excluded from Git tracking (node_modules, .env)
├── app.js                     # Express app configuration & middleware pipeline
├── database.js                # MongoDB connection handler via Mongoose
├── index.js                   # Application entry point & server listener
├── package.json               # Project manifest, dependencies, and scripts
├── postman_collection.json    # Import-ready Postman collection for all tests
└── README.md                  # Project documentation & evaluation guide
```

### Flow of a Request
```
Client (Postman / Browser)
         │
         ▼
[index.js]  ─── Starts HTTP Server and connects to MongoDB Atlas
         │
         ▼
 [app.js]   ─── Parses JSON middleware, logs request, routes traffic
         │
         ▼
 [Routes]   ─── Directs path to corresponding controller function
         │
         ▼
[Controller]─── Executes business logic, hashes passwords, coordinates queries
         │
         ▼
  [Model]   ─── Validates schema and executes database operations with MongoDB
         │
         ▼
  Response  ─── Returns standard JSON and HTTP status codes (200, 201, 400, 404, 500)
```

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **Git** (for version control and pushing to GitHub)
- **Postman Desktop Agent / App** (for testing the REST APIs)
- A free **MongoDB Atlas** account ([https://www.mongodb.com/atlas](https://www.mongodb.com/atlas))

---

## Step (a): Node Project Setup & Git / GitHub

### 1. Initialize Project & Install Dependencies
```bash
npm init -y
npm install express mongoose dotenv bcryptjs cors
npm install -D nodemon
```

### 2. Configure ES Modules & Scripts in `package.json`
Add `"type": "module"` to `package.json` to enable modern ES6 imports:
```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### 3. Add Project to GitHub
Initialize your Git repository, commit files, and push to a new public GitHub repo:
```bash
# 1. Initialize git
git init

# 2. Stage and commit all files
git add .
git commit -m "Initial commit: Node.js Express MongoDB CRUD API"

# 3. Create a public repository on GitHub (e.g. backend-tutorial)
# Then link your local repository and push:
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> **Security Note:** Never commit your `.env` file! The `.gitignore` file already includes `.env` to prevent leaking your MongoDB credentials.

---

## Step (b): Setting Up Online MongoDB Atlas Cluster

1. **Sign Up / Log In:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create a Cluster:**
   - Choose the **M0 Free Tier** (Shared).
   - Select your preferred cloud provider and region (e.g., AWS / Mumbai or N. Virginia).
   - Click **Create Deployment**.
3. **Set Up Security / Database User:**
   - Navigate to **Security** > **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password Authentication**.
   - Enter a username (e.g., `admin`) and a secure password.
   - Set privileges to **Read and write to any database**.
4. **Configure IP Access List:**
   - Navigate to **Security** > **Network Access**.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) so you can connect from home, college, or hostel.
5. **Get Your Connection String:**
   - Navigate to **Database** > click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection URI string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Update `.env`:**
   Open `.env` in the project root and replace `<username>`, `<password>`, and optionally set a database name like `backend-db`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/backend-db?retryWrites=true&w=majority
   ```

---

## Step (c): Creating MongoDB Database Models

We use Mongoose schemas to define strictly typed models with built-in validation.

### 1. User Model (`models/user.model.js`)
Stores user credentials with validation and timestamps:
- `username`: String (required, unique, min length 3)
- `email`: String (required, unique, regex email format)
- `password`: String (required, hashed using `bcryptjs`)
- `createdAt`, `updatedAt`: Auto-generated timestamps

### 2. Post Model (`models/post.model.js`)
Stores blog / community post documents:
- `title`: String (required, trimmed, max length 120)
- `content`: String (required)
- `author`: String (default: 'Anonymous')
- `category`: String (default: 'General')
- `createdAt`, `updatedAt`: Auto-generated timestamps

---

## Step (d): Express REST APIs & Controllers (CRUD & Auth)

### 1. User Authentication APIs

| HTTP Method | Route | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register new user, hashes password | `201 Created` |
| `POST` | `/api/users/login` | Verifies email & password match | `200 OK` |
| `POST` | `/api/users/logout` | Logs out current user session | `200 OK` |
| `GET` | `/api/users` | List all registered users (sanitized) | `200 OK` |

### 2. Post CRUD APIs (Create, Read, Update, Delete)

| Operation | HTTP Method | Route | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/api/posts` | Create a new post document | `201 Created` |
| **READ ALL** | `GET` | `/api/posts` | Retrieve all posts (sorted newest) | `200 OK` |
| **READ ONE** | `GET` | `/api/posts/:id` | Fetch specific post by its `_id` | `200 OK` or `404` |
| **UPDATE** | `PUT` | `/api/posts/:id` | Modify post fields by its `_id` | `200 OK` or `404` |
| **DELETE** | `DELETE` | `/api/posts/:id` | Remove post permanently by `_id` | `200 OK` or `404` |

---

## Step (e): Testing APIs with Postman Desktop

A ready-to-import Postman collection is included in this repository: [`postman_collection.json`](./postman_collection.json).

### How to Import and Use the Postman Collection:
1. Open the **Postman Desktop App**.
2. Click **Import** (top left).
3. Drag & drop `postman_collection.json` into Postman.
4. The collection **"Backend Tutorial - Node & Express CRUD APIs"** will appear in your left sidebar with all preconfigured requests!

### Step-by-Step API Testing Walkthrough:

#### 1. Server Health Check
- **Request:** `GET http://localhost:5000/`
- **Expected Response:** `200 OK` with welcome message and route catalog.

#### 2. Register User
- **Request:** `POST http://localhost:5000/api/users/register`
- **Body (JSON):**
  ```json
  {
    "username": "alexdev",
    "email": "alex@example.com",
    "password": "Password123"
  }
  ```
- **Expected Response:** `201 Created` with created user ID and username (password excluded).

#### 3. Login User
- **Request:** `POST http://localhost:5000/api/users/login`
- **Body (JSON):**
  ```json
  {
    "email": "alex@example.com",
    "password": "Password123"
  }
  ```
- **Expected Response:** `200 OK` with `"User logged in successfully!"`.

#### 4. Create Post (CREATE)
- **Request:** `POST http://localhost:5000/api/posts`
- **Body (JSON):**
  ```json
  {
    "title": "Mastering Node and Express",
    "content": "Building full-stack backend applications with MongoDB Atlas.",
    "author": "alexdev",
    "category": "Backend"
  }
  ```
- **Expected Response:** `201 Created` with post details including auto-assigned `_id`.
- 💡 **Copy the `_id`** from the response (e.g. `672661879...`) to use in the following requests!

#### 5. Get All Posts (READ ALL)
- **Request:** `GET http://localhost:5000/api/posts`
- **Expected Response:** `200 OK` with `count: 1` and array containing all posts.

#### 6. Get Single Post (READ ONE)
- **Request:** `GET http://localhost:5000/api/posts/<PASTE_POST_ID>`
- **Expected Response:** `200 OK` with the exact post document.

#### 7. Update Post (UPDATE)
- **Request:** `PUT http://localhost:5000/api/posts/<PASTE_POST_ID>`
- **Body (JSON):**
  ```json
  {
    "title": "Mastering Node and Express (Updated Edition)",
    "content": "Successfully updated content via PUT request in Postman!",
    "category": "Full Stack Mastery"
  }
  ```
- **Expected Response:** `200 OK` showing updated fields and new `updatedAt` timestamp.

#### 8. Delete Post (DELETE)
- **Request:** `DELETE http://localhost:5000/api/posts/<PASTE_POST_ID>`
- **Expected Response:** `200 OK` with confirmation message: `"Post '...' deleted successfully!"`.
- **Verification:** Re-running `GET /api/posts/<PASTE_POST_ID>` will now return `404 Not Found`.

---

## 💻 Running the Application on Your Laptop

### Standard Production Mode:
```bash
npm start
```

### Development Mode (with automatic server reload on code changes):
```bash
npm run dev
```

Once running, your terminal will display:
```
=================================================
🚀 Server listening on port 5000
📡 Local URL: http://localhost:5000
📝 Ready to receive requests from Postman or browser
=================================================
```

---
