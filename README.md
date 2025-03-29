# User Management System with Reqres API

**Live Demo:** [https://user-management-reqres-suyash.vercel.app/](https://user-management-reqres-suyash.vercel.app/)

## 📋 Overview

This project is a user management application that integrates with the Reqres API. It demonstrates core features of a modern React application, including authentication, data fetching, state management, and CRUD operations.

The application offers a sleek, glass-morphic UI design with full responsiveness across all device sizes.

## ✨ Features

- **Authentication** - Secure login system with token-based authentication
- **User Management** - View, edit, and delete users
- **Pagination** - Navigate through pages of user data
- **Responsive Design** - Glass-morphic UI that works on all devices
- **State Management** - Centralized state using Redux
- **Toast Notifications** - User-friendly notifications for actions
- **Form Validation** - Input validation for all forms
- **Protected Routes** - Route protection based on authentication status

## 🛠️ Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - API requests
- **Shadcn/UI** - Component library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/user-management-reqres.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user-management-reqres
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. The application should now be running on `http://localhost:5173`

## 🔐 Authentication

The application uses token-based authentication with the Reqres API. Default credentials are:

- **Email:** eve.holt@reqres.in
- **Password:** cityslicka

The authentication token is stored in local storage for persistence between sessions.

## 📱 Pages

### Login Page

- User authentication with form validation
- Displays error messages for failed login attempts

### User List Page

- Displays a table of users with their details
- Pagination controls for navigating through user pages
- Edit and delete functionality for each user
- User profile dropdown for logout

### Edit User Page

- Form for updating user details
- Validation for required fields
- Success/error notifications

## 🔄 State Management

Redux Toolkit is used for state management with the following slices:

- **Auth Slice** - Manages authentication state, login, and logout
- **User Slice** - Handles user data, CRUD operations, and pagination state

## 🎨 Styling

The application features a modern glass-morphic UI with:

- Translucent card components
- Dynamic color effects
- Responsive design for all screen sizes
- Customized Shadcn UI components

## 📝 API Integration

The application integrates with the Reqres API for:

- User authentication (`POST /api/login`)
- Fetching users (`GET /api/users?page={page}`)
- Updating users (`PUT /api/users/{id}`)
- Deleting users (`DELETE /api/users/{id}`)

## 🧪 Future Improvements

- Add search functionality
- Implement sorting by different columns
- Add user creation feature
- Implement unit and integration tests
- Add dark/light theme toggle
- Enhance accessibility features

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

- [Suyash Gupta](https://github.com/suyashgupta2411)
