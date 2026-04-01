import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
          <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
          <p className="mt-2 text-sm text-zinc-300">
            The application encountered an error. Refresh the page or return to the landing page.
          </p>
          <details className="mt-4 whitespace-pre-wrap text-xs text-zinc-300">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
