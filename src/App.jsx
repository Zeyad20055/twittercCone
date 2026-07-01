// ============================================================
// APP.JSX - Root Component
// ============================================================

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: '#1A1F23',
            border: '1px solid #2F3336',
            color: '#E7E9EA',
            borderRadius: '12px',
          }}
        />

        {/* App Routes */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
