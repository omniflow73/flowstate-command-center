
import { createRoot } from 'react-dom/client';
import { StrictMode, Component, type ReactNode } from 'react';
import App from './App.tsx';
import './index.css';

// Error boundary for the entire application
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: any) {
    console.error("Application error:", error);
    return { hasError: true };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("React error details:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2">Please refresh the page to try again</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Failed to load application: Root element not found</div>';
} else {
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
    
    console.log("Application successfully mounted");
  } catch (error) {
    console.error("Failed to render application:", error);
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Failed to load application. Please check console for details.</div>';
  }
}
