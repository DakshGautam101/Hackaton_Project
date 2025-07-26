import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import ProtectedRoute from './components/Layout/ProtectedRoute.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import HomePage from './Pages/HomePage.jsx';
import MarketplacePage from './pages/MarketPlace.jsx';
import PoolPage from './Pages/PoolPage.jsx';
import WalletPage from './Pages/WalletPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import MapPage from './Pages/MapPage.jsx';
import Footer from './components/Layout/Footer.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-orange-500">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
              <Route path="/pools" element={<PoolPage />} />
              <Route path="/wallet" element={<WalletPage />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;