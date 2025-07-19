# Feedback Collection Platform

A comprehensive platform that allows businesses (admins) to create customized feedback forms and collect responses from users. Users can access forms via a public URL without requiring login, while admins can view responses in both tabular and summary formats.

## Features

- **User Authentication**: JWT-based auth for admins (businesses)
- **Form Creation**: Create customizable feedback forms with multiple question types (text, multiple choice)
- **Public Form Access**: Users can submit feedback via public links without logging in
- **Response Management**: View and analyze form responses in tabular and summary views
- **CSV Export**: Export form responses as CSV files
- **Responsive Design**: Mobile-friendly UI for all device types

## Tech Stack

### Frontend

- React 19 with Hooks
- React Router v7 for navigation
- TailwindCSS v4 for styling
- Axios for API communication
- React Hot Toast for notifications
- Lucide React for icons

### Backend

- Node.js & Express.js
- MongoDB with Mongoose for database
- JWT for authentication
- Validation middleware for data integrity

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd feedback-collection-platform
```

2. Install backend dependencies

```bash
cd Server
npm install
```

3. Set up environment variables
   Create a `.env` file in the Server directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Install frontend dependencies

```bash
cd ../Client
npm install
```

5. Start the backend server

```bash
cd ../Server
npm start
```

6. Start the frontend development server

```bash
cd ../Client
npm run dev
```

7. Access the application
   Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login** as an admin
2. **Create a form** with custom questions
3. **Share the form link** with users
4. **View responses** in the dashboard
5. **Analyze data** in the summary view
6. **Export responses** as CSV if needed

## Project Structure

```
├── Client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React contexts (Auth)
│       ├── pages/          # Page components
│       └── utils/          # Helper functions and API calls
│
└── Server/                 # Express backend
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middlewares/        # Custom middlewares
    ├── models/             # Database models
    ├── routes/             # API routes
    └── utils/              # Helper functions
```

## Design Decisions

- **JWT Authentication**: Provides secure, stateless authentication for admins
- **Public Form Access**: Allows anonymous feedback submission for higher response rates
- **Responsive Design**: Ensures usability across all device types
- **Chart Visualizations**: Provides visual insights for multiple-choice questions
- **CSV Export**: Enables further data analysis in external tools

## License

This project is licensed under the MIT License - see the LICENSE file for details.
