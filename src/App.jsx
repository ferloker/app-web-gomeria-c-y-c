import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SosPage from './pages/SosPage';
import StorePage from './pages/StorePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/tienda" element={<StorePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
