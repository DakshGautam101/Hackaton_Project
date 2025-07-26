import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import MarketPlace from './components/MarketPlace';
import PoolPage from './components/PoolPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LocationForm from './Pages/LocationForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/pools" element={<PoolPage />} />
            </Route>
          </Routes>
          <LocationForm/>
        </main>
      </div>
    </Router>
  );
}

export default App;
