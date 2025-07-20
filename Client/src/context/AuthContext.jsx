import { createContext, useState, useContext, useEffect } from "react";
import { loginUser, logoutUser, registerUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user data in localStorage on initial load
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // Store token for API requests
        toast.success("Logged in successfully");
        navigate("/dashboard");
        return true;
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const data = await registerUser({ name, email, password });

      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // Store token for API requests
        toast.success("Account created successfully");
        navigate("/dashboard");
        return true;
      }
    } catch (error) {
      toast.error(error.message || "Failed to register");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setCurrentUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Also remove token
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
