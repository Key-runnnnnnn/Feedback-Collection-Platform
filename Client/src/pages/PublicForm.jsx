import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFormById, submitFormResponse } from "../utils/api";
import { ArrowLeft, Loader, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const PublicForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await getFormById(formId);
        if (response.success) {
          setForm(response.form);

          // Initialize empty responses for each question
          const initialResponses = {};
          response.form.questions.forEach((question) => {
            initialResponses[question._id] =
              question.type === "multiple-choice" ? "" : "";
          });
          setFormResponses(initialResponses);
        } else {
          setError("Form not found");
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        setError(error.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setFormResponses({ ...formResponses, [questionId]: value });
  };

  const validateResponses = () => {
    const unanswered = form.questions.filter((question) => {
      const response = formResponses[question._id];
      return (
        response === "" || (Array.isArray(response) && response.length === 0)
      );
    });

    if (unanswered.length > 0) {
      toast.error(`Please answer all questions before submitting`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateResponses()) {
      return;
    }

    setSubmitting(true);

    try {
      const formattedResponses = {
        answers: Object.keys(formResponses).map((questionId) => ({
          questionId,
          answer: formResponses[questionId],
        })),
      };

      const response = await submitFormResponse(formId, formattedResponses);
      if (response.success) {
        setSubmitted(true);
        toast.success("Feedback submitted successfully");
      } else {
        toast.error(response.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Submit form error:", error);
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
        <p className="text-gray-600 mb-4">
          The form you are looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-green-100 rounded-full p-3 inline-flex mx-auto mb-6">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            Your feedback has been submitted successfully. We appreciate your
            time and input!
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{form.title}</h1>
          <p className="text-gray-600 mt-2">
            Please provide your feedback by filling out this form
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {form.questions.map((question, index) => (
            <div
              key={question._id}
              className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0"
            >
              <label className="block text-base font-medium text-gray-800 mb-2">
                {index + 1}. {question.question}
              </label>

              {question.type === "text" ? (
                <textarea
                  value={formResponses[question._id] || ""}
                  onChange={(e) =>
                    handleInputChange(question._id, e.target.value)
                  }
                  placeholder="Type your answer here"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              ) : (
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center">
                      <input
                        id={`question-${question._id}-option-${optIdx}`}
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        checked={formResponses[question._id] === option}
                        onChange={() => handleInputChange(question._id, option)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        required
                      />
                      <label
                        htmlFor={`question-${question._id}-option-${optIdx}`}
                        className="ml-2 text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
