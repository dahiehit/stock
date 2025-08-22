import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import LocationsPage from './pages/LocationsPage';
import JardaPage from './pages/JardaPage'; // ✅ FIXED: correct name
import ItemsSearchPage from './pages/ItemsSearchPage';
import CategoryPage from './pages/CategoryPage';
import UnitPage from './pages/UnitPage';
import EmployeesPage from "./pages/EmployeesPage";



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
            <Route path="/jarda" element={<JardaPage />} />
            <Route path="/search" element={<ItemsSearchPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/units" element={<UnitPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
