# Student Grievance Management System

A MERN Stack application for managing student grievances in colleges.

## Project Structure

```
StudentGrievanceSystem/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React + Vite Frontend
└── README.md
```

## Features

### Backend
- User Registration & Login with JWT
- Bcrypt password hashing
- RESTful APIs for CRUD operations on grievances
- Role-based access control
- Search functionality

### Frontend
- User Registration & Login
- Dashboard with grievance management
- Create, Read, Update, Delete grievances
- Search grievances by title
- Responsive design
- Local authentication with tokens

## Technologies Used

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI Library
- **Vite** - Build tool
- **Axios** - HTTP Client
- **CSS3** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for cloud database) OR MongoDB installed locally
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grievance_system
JWT_SECRET=your_jwt_secret_key_here

# Run development server
npm run dev

# Run production server
npm start
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables (already configured)
# .env file is ready to use

# Run development server
npm run dev

# Build for production
npm run build
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student

### Grievances
- `POST /api/grievances` - Submit new grievance (Protected)
- `GET /api/grievances` - Get all grievances (Protected)
- `GET /api/grievances/:id` - Get grievance by ID (Protected)
- `PUT /api/grievances/:id` - Update grievance (Protected)
- `DELETE /api/grievances/:id` - Delete grievance (Protected)
- `GET /api/grievances/search/byTitle?title=xyz` - Search grievance (Protected)

## MongoDB Schema

### Student
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date (default: now)
}
```

### Grievance
```javascript
{
  studentId: ObjectId (ref: Student),
  title: String (required),
  description: String (required),
  category: String (enum: Academic, Hostel, Transport, Other),
  status: String (enum: Pending, Resolved, default: Pending),
  date: Date (default: now),
  createdAt: Date (default: now)
}
```

## Deployment

### Deploy Backend on Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repo
5. Set Environment Variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `NODE_ENV` - `production`
6. Deploy

### Deploy Frontend on Render

1. Build your React app: `npm run build`
2. Create new Static Site on Render
3. Connect your GitHub repo
4. Set Build Command: `npm install && npm run build`
5. Set Publish Directory: `dist`
6. Update `VITE_API_URL` to your deployed backend URL
7. Deploy

## Running the Project Locally

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Seed Sample Data

From the backend folder:

```bash
# Add sample students and grievances (keeps existing records)
npm run seed

# Reset students+grievances and seed fresh sample data
npm run seed:reset
```

Sample student logins seeded (password for all: `password123`):
- `aarav.mehta@example.com`
- `diya.sharma@example.com`
- `rohan.verma@example.com`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Testing with Postman/Thunder Client

### 1. Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Submit Grievance
```
POST http://localhost:5000/api/grievances
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Class room issue",
  "description": "Room temperature is too cold",
  "category": "Academic"
}
```

### 4. Get All Grievances
```
GET http://localhost:5000/api/grievances
Authorization: Bearer <token>
```

## Error Handling

- **Duplicate Email**: Returns 400 status
- **Invalid Credentials**: Returns 400 status
- **Unauthorized Access**: Returns 401 status
- **Forbidden Access**: Returns 403 status
- **Not Found**: Returns 404 status

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes requiring authentication
- CORS enabled for safe cross-origin requests
- Environment variables for sensitive data

## License

This project is for educational purposes.

## Support

For issues or questions, please check the code or contact your instructor.
