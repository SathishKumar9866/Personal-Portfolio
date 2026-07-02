import { Component } from "react";

// App-level safety net — never white-screen the visitor.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-mono text-[12px] uppercase tracking-label text-accent">Something broke</p>
          <h1 className="mt-3 font-display text-white-100 text-[32px]">This page hit an error.</h1>
          <p className="mt-3 font-serif text-secondary">
            Reload to try again — or reach me at{" "}
            <a className="text-accent" href="mailto:sathishkumar786.ml@gmail.com">
              sathishkumar786.ml@gmail.com
            </a>
            .
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-accent px-5 py-2.5 font-mono text-[13px] font-semibold text-primary"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
