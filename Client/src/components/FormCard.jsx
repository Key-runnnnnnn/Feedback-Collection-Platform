import { Link } from "react-router-dom";
import { Calendar, BarChart2, FileText, Share2 } from "lucide-react";

const FormCard = ({ form }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
   
  
  const createdAt = form.createdAt || new Date().toISOString();
  const shareUrl = `${window.location.origin}/form/${form._id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Form link copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {form.title}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar size={14} className="mr-1" />
          <span>Created on {formatDate(createdAt)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {form.questions?.length || 0} questions
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            to={`/form-responses/${form._id}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
          >
            <FileText size={14} className="mr-1" />
            Responses
          </Link>
          <Link
            to={`/form-summary/${form._id}`}
            className="inline-flex items-center px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md text-sm font-medium"
          >
            <BarChart2 size={14} className="mr-1" />
            Summary
          </Link>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md text-sm font-medium"
          >
            <Share2 size={14} className="mr-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
