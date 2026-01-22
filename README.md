# Task Manager

There are days when tasks pile up quietly, like vinyl records stacked beside a turntable.  
You don’t notice them all at once—until you do.

This application exists for those days.

It is a full-stack Task Management Web Application that allows users to register, log in, and keep track of the things that need doing. Nothing more. Nothing less. It works reliably in the background, like a clock that never asks for attention but keeps perfect time.

---

## What This Project Is

This project is a practical implementation of a modern web stack, separated cleanly into frontend, backend, and database layers. Each layer knows its role. None interferes with the others.

It is designed to be:

- secure  
- predictable  
- deployable in the real world  

---

## Features

- User registration and authentication using JWT  
- Secure password storage with bcrypt  
- Task creation, reading, updating, and deletion  
- Tasks scoped strictly to the logged-in user  
- Protected routes that do not reveal themselves to strangers  
- Responsive layout for desktop and mobile  

---

## Technology Stack

### Frontend

- React (Vite)  
- React Router  
- Fetch API  
- Custom CSS  
- Deployed on **Vercel**

The frontend is a Single Page Application.  
It does not shout. It waits for input.

---

### Backend

- Node.js  
- Express.js  
- JWT Authentication  
- MySQL integration  
- Deployed on **Vercel**

The backend handles responsibility quietly: validation, authentication, persistence.

---

### Database

- MySQL  
- Hosted on **Railway**

The database remembers things even after the browser is closed. That is its only job, and it does it well.

---

## Architecture

```
Client (React)
      ↓
API (Express / JWT)
      ↓
Database (MySQL)
```

Each request passes through this structure like a thought moving through layers of consciousness—validated, authenticated, then stored.

---

## Deployment

### Frontend Deployment (Vercel)

Because this is a Single Page Application, routing is handled on the client.  
To ensure direct navigation and page refreshes work correctly, the following rewrite configuration is required.

**vercel.json**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

### Backend Deployment (Vercel)

The backend runs as a Node.js service on Vercel.

Required environment variables:

```
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
```

These values are not stored in the code.

---

### Database (MySQL on Railway)

Railway hosts the MySQL database.  
The database connection string is used as `DATABASE_URL` in the backend.

---

## Database Schema

### Users

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Authentication Flow

1. User registers  
2. Password is hashed  
3. User logs in  
4. JWT token is issued  
5. Token is sent with protected requests  

```
Authorization: Bearer <token>
```

---

## API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Tasks (Protected)
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

---

## Security Considerations

- Passwords are never stored in plain text  
- JWT secrets live only in environment variables  
- Users can access only their own data  

---

## Author

**Akshita Sharma**  
Full-Stack Developer  

Sometimes, finishing a task is simply about knowing where to stop.
