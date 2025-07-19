import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import PublicForm from "./pages/PublicForm";
import FormResponses from "./pages/FormResponses";
import FormSummary from "./pages/FormSummary";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow py-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/form/:formId" element={<PublicForm />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-form"
                element={
                  <PrivateRoute>
                    <CreateForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/form-responses/:formId"
                element={
                  <PrivateRoute>
                    <FormResponses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/form-summary/:formId"
                element={
                  <PrivateRoute>
                    <FormSummary />
                  </PrivateRoute>
                }
              />

              {/* Default route */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
