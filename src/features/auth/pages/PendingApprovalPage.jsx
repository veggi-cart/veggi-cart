import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PendingApprovalPage = () => {
  const navigate = useNavigate();
  const { user, logout, isApproved } = useAuth();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // If user is approved, redirect to home
    if (isApproved) {
      navigate("/", { replace: true });
    }
  }, [user, isApproved, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-100 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Pending Icon */}
          <div className="mx-auto flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Account Pending Approval
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thank you for registering,{" "}
            <span className="font-semibold">{user.fullName}</span>! Your account
            is currently under review by our admin team.
          </p>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Our team will review your account details</li>
                  <li>• You'll receive a notification once approved</li>
                  <li>• This usually takes 24-48 hours</li>
                  <li>• You can check back anytime by logging in</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Your Account Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">
                  {user.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">
                  {user.phoneNumber}
                </span>
              </div>
              {user.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">
                    {user.email}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Pending Approval
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Refresh Status
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-xs text-gray-500">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@example.com"
              className="text-indigo-600 hover:text-indigo-500"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
