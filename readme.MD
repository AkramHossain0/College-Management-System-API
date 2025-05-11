# College Management System API

A comprehensive backend REST API for managing college operations, including student and teacher administration, attendance tracking, result management, and notice distribution.
🔧 **Built with Node.js and Express.js**

## Overview

The College Management System API is built with **Node.js** and **Express.js**, providing secure endpoints for different user roles (Admin, Teachers, Students) with proper authentication and authorization mechanisms. The system uses **MongoDB** for data persistence and **Redis** for caching and session management.

## Features

### 🔐 Role-Based Authentication System

* **Separate authentication** for Admin, Teachers, and Students.
* **JWT-based** secure authentication.
* **Password encryption** with bcrypt.
* **Email verification** for new accounts.
* **Password recovery** workflow.

### 👨‍🎓 Student Management

* Complete **student information management**:

  * Academic and personal details.
  * Family information.
  * Emergency contact details.

### 👩‍🏫 Teacher Management

* **Teacher profile and qualifications**.
* Employment information.
* Contact details.

### 📚 Academic Features

* **Attendance tracking** and reporting.
* **Comprehensive result management**.
* **Notice/announcement distribution**.

### 📊 Dashboard Analytics

* **Student and teacher statistics**.
* Department-wise distributions.
* **Status overviews**.

## Technology Stack

* **Runtime Environment**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Caching/Session**: Redis
* **Authentication**: JWT (JSON Web Tokens)
* **Security**: bcrypt for password hashing, AES encryption for sensitive data
* **Email Service**: Nodemailer

## API Endpoints

### 🔑 Authentication Routes

#### Admin

* **POST** `/api/admin/login` - Admin login

#### Teacher

* **POST** `/api/teacher/register` - Teacher registration
* **POST** `/api/teacher/verify` - Email verification
* **POST** `/api/teacher/login` - Teacher login
* **POST** `/api/teacher/forgot-password` - Password reset request
* **POST** `/api/teacher/reset-password` - Password reset

#### Student

* **POST** `/api/student/register` - Student registration
* **POST** `/api/student/verify-email` - Email verification
* **POST** `/api/student/login` - Student login
* **POST** `/api/student/forgot-password` - Password reset request
* **POST** `/api/student/reset-password` - Password reset

### 📋 Student Management

* **POST** `/api/student-management/new-student` - Add new student
* **GET** `/api/student-management` - Get all students
* **PUT** `/api/student-management/update-student/:id` - Update student information
* **DELETE** `/api/student-management/delete-student/:id` - Delete student

### 👨‍🏫 Teacher Management

* **POST** `/api/teacher-management/add-teacher` - Add new teacher
* **GET** `/api/teacher-management` - Get all teachers
* **PUT** `/api/teacher-management/update-teacher/:id` - Update teacher information
* **DELETE** `/api/teacher-management/delete-teacher/:id` - Delete teacher

### 📝 Results Management

* **POST** `/api/result` - Add result
* **GET** `/api/result/:studentId` - Get student results
* **GET** `/api/result` - Get all/filtered results
* **PUT** `/api/result/:id` - Update result
* **DELETE** `/api/result/:id` - Delete result

### 📢 Notice Board

* **POST** `/api/notice` - Create notice
* **GET** `/api/notice` - Get all notices
* **GET** `/api/notice/:id` - Get notice by ID
* **PUT** `/api/notice/:id` - Update notice
* **DELETE** `/api/notice/:id` - Delete notice

### 📅 Attendance Management

* **POST** `/api/attendance/add` - Add attendance
* **GET** `/api/attendance/all` - Get all attendance records
* **GET** `/api/attendance/student/:studentId` - Get attendance by student ID
* **GET** `/api/attendance/date/:date` - Get attendance by date
* **PUT** `/api/attendance/update/:id` - Update attendance
* **DELETE** `/api/attendance/delete/:id` - Delete attendance

### 📊 Dashboard

* **GET** `/api/dashboard` - Get dashboard analytics data

## Setup & Installation

### ⚙️ Prerequisites

* **Node.js** (v14 or higher)
* **MongoDB**
* **Redis**

### 🔧 Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/AkramHossain0/College-Management-System-API.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root and add the following configuration:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   COOKIE_SECRET=your_cookie_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Start Redis server**
   Install Redis if not already installed, and ensure Redis is running on the default port (6379).

5. **Start the application**

   ```bash
   npm start
   ```

## 🔒 Security Features

* **JWT-based** authentication with encryption.
* **Secure password hashing** with bcrypt.
* **Session management** with Redis.
* **AES encryption** for sensitive data.
* **Email verification** for new accounts.
* **Role-based authorization** for APIs.

## Data Models

### 👨‍🎓 Student

* Personal information
* Academic details
* Family information
* Contact details

### 👩‍🏫 Teacher

* Personal information
* Qualifications
* Employment details
* Contact information

### 📅 Attendance

* Student identification
* Date and status records

### 📝 Result

* Student identification
* Course information
* Marks and evaluation details

### 📢 Notice

* Title and description
* Publishing details and timestamps

## 🚨 Error Handling

The API implements consistent error handling across all endpoints with appropriate HTTP status codes and descriptive messages.

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more details.

---

