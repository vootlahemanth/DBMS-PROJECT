import React from 'react';
import { AlertTriangle, RefreshCw, Home, Compass } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Universal Tickets ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <div className="error-icon-wrap">
              <AlertTriangle size={36} />
            </div>
            <h2>Unable to load this section</h2>
            <p>
              An unexpected error occurred while rendering this page. Don't worry, your session and tickets are completely safe.
            </p>
            {this.state.error && (
              <div className="error-details-box">
                <code>{this.state.error.toString()}</code>
              </div>
            )}
            <div className="error-actions">
              <button className="button button-primary" onClick={this.handleReload}>
                <RefreshCw size={15} /> Try Again
              </button>
              <button className="button button-secondary" onClick={this.handleReset}>
                <Home size={15} /> Back to Home
              </button>
              <a href="/events" className="button button-ghost">
                <Compass size={15} /> Browse Events
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
