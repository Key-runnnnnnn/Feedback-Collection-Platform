import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllForms } from "../utils/api";
import FormCard from "../components/FormCard";
import { Plus, Inbox, Loader } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getAllForms();
        if (data.success) {
          setForms(data.forms);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        setError(error.message || "Failed to fetch forms");
        toast.error("Failed to load forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading your forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (    
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Forms</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your feedback forms
          </p>
        </div>
        <Link
          to="/create-form"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Inbox className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No forms yet
          </h3>
          <p className="mt-2 text-gray-500">
            Create your first feedback form to get started
          </p>
          <div className="mt-6">
            <Link
              to="/create-form"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Create New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <FormCard key={form._id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
