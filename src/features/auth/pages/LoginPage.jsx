import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApiCall } from "../../../api/use.apiCall";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isPending, loading: authLoading } = useAuth();

  const { execute: handleLogin, loading } = useApiCall(login, {
    onSuccess: (result) => {
      if (!result) return;
      if (result.data?.accountStatus === "pending") {
        navigate("/pending-approval");
      } else {
        navigate("/");
      }
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(isPending ? "/pending-approval" : "/", { replace: true });
    }
  }, [isAuthenticated, isPending, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Login to your account</p>
        </div>

        {/* Card — no inline error banner; errors go to the global toast */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoginForm onSubmit={handleLogin} loading={loading} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2024 FreshMart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
