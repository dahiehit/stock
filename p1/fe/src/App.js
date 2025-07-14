import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import LocationsPage from './pages/LocationsPage';
import MovementsPage from './pages/MovementsPage';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Sidebar />

        {/* Main Content */}
        <div className="pt-6 pr-16 md:pr-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/movements" element={<MovementsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
