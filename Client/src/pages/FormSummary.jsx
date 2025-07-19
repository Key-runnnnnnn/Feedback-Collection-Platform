import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getFormById, getFormSummary } from "../utils/api";
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  PieChart,
  BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";

const FormSummary = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);

        const [formResponse, summaryResponse] = await Promise.all([
          getFormById(formId),
          getFormSummary(formId),
        ]);

        if (formResponse.success && summaryResponse.success) {
          setForm(formResponse.form);
          setSummary(summaryResponse.summary);
        } else {
          setError("Failed to load form data");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError(error.message || "Failed to load form data");
        toast.error("Failed to load form summary");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const calculatePercentage = (optionCount, questionId) => {
    const questionSummary = summary[questionId];
    if (!questionSummary) return 0;

    const totalResponses = Object.values(questionSummary).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalResponses === 0) return 0;

    return Math.round((optionCount / totalResponses) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading summary...</p>
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

  const hasSummaryData = Object.keys(summary).length > 0;

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

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {form.title} - Summary
            </h1>
            <p className="text-gray-600 mt-1">
              Visual overview of form responses
            </p>
          </div>
          <Link
            to={`/form-responses/${formId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View All Responses
          </Link>
        </div>
      </div>

      {!hasSummaryData ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No summary available
          </h3>
          <p className="mt-2 text-gray-500">
            This form hasn't received enough responses yet or doesn't have
            multiple-choice questions to summarize.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {form.questions.map((question) => {
            if (question.type !== "multiple-choice") {
              return (
                <div
                  key={question._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {question.question}
                  </h3>
                  <p className="text-gray-500 italic">
                    Text question - no summary available
                  </p>
                </div>
              );
            }

            const questionSummary = summary[question._id] || {};
            const hasData = Object.values(questionSummary).some(
              (count) => count > 0
            );

            if (!hasData) {
              return (
                <div
                  key={question._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {question.question}
                  </h3>
                  <p className="text-gray-500 italic">No responses yet</p>
                </div>
              );
            }

            return (
              <div
                key={question._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    {question.question}
                  </h3>
                  <PieChart size={18} className="text-blue-600" />
                </div>

                <div className="space-y-4 mt-4">
                  {question.options.map((option) => {
                    const count = questionSummary[option] || 0;
                    const percentage = calculatePercentage(count, question._id);

                    return (
                      <div key={option} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">
                            {option}
                          </p>
                          <p className="text-sm text-gray-500">
                            {count} ({percentage}%)
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormSummary;
