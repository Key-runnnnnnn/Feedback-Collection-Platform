import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createForm } from "../utils/api";
import { Plus, Minus, Trash2, Save, List, Type } from "lucide-react";
import toast from "react-hot-toast";

const CreateForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    questions: [
      { type: "text", question: "", options: [] },
      { type: "text", question: "", options: [] },
      { type: "text", question: "", options: [] },
    ],
  });

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    if (formData.questions.length >= 5) {
      toast.error("Maximum 5 questions allowed");
      return;
    }

    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { type: "text", question: "", options: [] },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 3) {
      toast.error("Minimum 3 questions required");
      return;
    }

    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleTypeChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].type = value;

    if (
      value === "multiple-choice" &&
      updatedQuestions[index].options.length === 0
    ) {
      updatedQuestions[index].options = ["", ""];
    }

    setFormData({ ...formData, questions: updatedQuestions });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please add a form title");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];

      if (!question.question.trim()) {
        toast.error(`Question ${i + 1} cannot be empty`);
        return false;
      }

      if (question.type === "multiple-choice") {
        if (question.options.length < 2) {
          toast.error(`Question ${i + 1} needs at least 2 options`);
          return false;
        }

        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j].trim()) {
            toast.error(`Option ${j + 1} in Question ${i + 1} cannot be empty`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createForm(formData);
      if (response.success) {
        toast.success("Form created successfully");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Failed to create form");
      }
    } catch (error) {
      console.error("Create form error:", error);
      toast.error(error.message || "Failed to create form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Feedback Form
          </h1>
          <p className="text-gray-600 mt-1">
            Design your feedback form with custom questions
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-8">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Form Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Enter form title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
              <p className="text-sm text-gray-500">
                {formData.questions.length} of 5 questions
              </p>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="mb-8 bg-gray-50 rounded-md p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Question {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove question"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="text"
                        checked={question.type === "text"}
                        onChange={() => handleTypeChange(questionIndex, "text")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        <Type size={14} className="mr-1" />
                        Text
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="multiple-choice"
                        checked={question.type === "multiple-choice"}
                        onChange={() =>
                          handleTypeChange(questionIndex, "multiple-choice")
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 flex items-center text-sm text-gray-700">
                        <List size={14} className="mr-1" />
                        Multiple Choice
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {question.type === "multiple-choice" && (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeOption(questionIndex, optionIndex)
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                          disabled={question.options.length <= 2}
                          aria-label="Remove option"
                        >
                          <Minus size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              disabled={formData.questions.length >= 5}
              className={`flex items-center justify-center w-full py-2 px-4 border border-dashed rounded-md ${
                formData.questions.length >= 5
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Plus size={18} className="mr-2" />
              Add Question
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Save size={18} className="mr-2" />
              {isSubmitting ? "Creating..." : "Create Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
