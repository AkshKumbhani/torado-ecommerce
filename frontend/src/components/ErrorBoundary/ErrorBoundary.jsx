import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          background: '#f9f9f9',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#d9534f', marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#666', maxWidth: '500px', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <button
            onClick={() => {
              window.location.hash = '#home';
              window.location.reload();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: '#5D19B4',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go Back Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
