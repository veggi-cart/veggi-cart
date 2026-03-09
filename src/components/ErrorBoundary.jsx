import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand text-white rounded-xl font-semibold transition-all active:scale-95 shadow-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
