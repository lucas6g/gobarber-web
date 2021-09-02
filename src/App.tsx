import React from 'react';

import GlobalStyles from './styles/global';

import AuthProvider from './context/AuthContext';
import ToastProvider from './context/ToastContext';

import Routes from './routes';

// criar um container por volta da pagina sempre
const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </AuthProvider>

      <GlobalStyles />
    </>
  );
};

export default App;
