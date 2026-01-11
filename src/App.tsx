import React from "react";
import Home from "./components/home";

function App() {
  // Gestion d'erreur globale pour éviter les erreurs asynchrones
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Global error caught:', event.error);
      // Ne pas propager l'erreur pour éviter les crashes
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      // Ne pas propager pour éviter les erreurs asynchrones
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    console.log('🚀 App mounted - Error handlers active');

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.log('🧹 App unmounting...');
    };
  }, []);

  return <Home />;
}

export default App;
