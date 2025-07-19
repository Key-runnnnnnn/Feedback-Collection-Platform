import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getFormById,
  getFormResponses,
  exportFormResponsesCSV,
} from "../utils/api";
import { ArrowLeft, Download, Loader, Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const FormResponses = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResponses, setFilteredResponses] = useState([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);

        const [formResponse, responsesResponse] = await Promise.all([
          getFormById(formId),
          getFormResponses(formId),
        ]);

        if (formResponse.success && responsesResponse.success) {
          setForm(formResponse.form);
          setResponses(responsesResponse.responses);
          setFilteredResponses(responsesResponse.responses);
        } else {
          setError("Failed to load form data");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError(error.message || "Failed to load form data");
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  useEffect(() => {
    if (!responses.length) return;

    if (!searchQuery.trim()) {
      setFilteredResponses(responses);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = responses.filter((response) => {
      return response.answers.some((answer) => {
        const answerText = String(answer.answer).toLowerCase();
        return answerText.includes(query);
      });
    });

    setFilteredResponses(filtered);
  }, [searchQuery, responses]);

  const handleExportCSV = async () => {
    try {
      await exportFormResponsesCSV(formId);
      toast.success("Exporting responses as CSV");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export responses");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQuestionById = (questionId) => {
    if (!form || !form.questions) return null;
    return form.questions.find((q) => q._id === questionId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading responses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
            <p className="text-gray-600 mt-1">
              {filteredResponses.length}{" "}
              {filteredResponses.length === 1 ? "response" : "responses"}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search responses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleExportCSV}
              disabled={responses.length === 0}
              className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                responses.length === 0 ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {filteredResponses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No responses found
          </h3>
          {searchQuery ? (
            <p className="mt-2 text-gray-500">
              No responses match your search criteria
            </p>
          ) : (
            <p className="mt-2 text-gray-500">
              This form hasn't received any submissions yet
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submitted At
                  </th>
                  {form.questions.map((question) => (
                    <th
                      key={question._id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {question.question}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((response, index) => (
                  <tr key={response._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(response.submittedAt)}
                    </td>

                    {form.questions.map((question) => {
                      const answer = response.answers.find(
                        (a) => a.questionId === question._id
                      );
                      const answerText = answer ? answer.answer : "-";

                      return (
                        <td
                          key={question._id}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {answerText}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
