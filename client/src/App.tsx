import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SharePage from './pages/SharePage/index';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>
        <ToastContainer position="top-right" theme="colored" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
