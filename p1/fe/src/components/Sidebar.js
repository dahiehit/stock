import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBoxOpen,
  FaWarehouse,
  FaExchangeAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaTag,         
  FaUserShield,  
   // ← الأيقونة الجديدة

} from 'react-icons/fa';

const navItems = [
  { name: 'الرئيسية', path: '/', icon: <FaHome /> },          // <-- Home added here
  { name: 'الاصول', path: '/items', icon: <FaBoxOpen /> },
  { name: 'المواقع', path: '/locations', icon: <FaWarehouse /> },
  { name: 'الجردة', path: '/jarda',  icon: <FaExchangeAlt /> },
  { name: 'البحث', path: '/search', icon: <FaSearch /> },
  { name: 'الفئات', path: '/categories', icon: <FaTag /> },
  { name: 'الوحدات', path: '/units', icon: <FaUserShield /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopHovered, setDesktopHovered] = useState(false);

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const closeMobileSidebar = () => setMobileOpen(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isOpen = isMobile ? mobileOpen : desktopHovered;

  return (
    <>
      {isMobile && (
        <button
          className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded shadow"
          onClick={toggleMobileSidebar}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      <div
        className={`fixed top-0 right-0 h-screen bg-white border-l shadow z-40 overflow-hidden transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={() => !isMobile && setDesktopHovered(true)}
        onMouseLeave={() => !isMobile && setDesktopHovered(false)}
      >
        <div className="p-4 text-lg font-bold whitespace-nowrap transition-opacity">
          <span className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition`}>
            المخزن
          </span>
        </div>

        <nav className="flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? closeMobileSidebar : undefined}
              className={`flex items-center gap-3 px-4 py-2 whitespace-nowrap hover:bg-gray-100 ${
                pathname === item.path ? 'bg-gray-200 font-bold' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={closeMobileSidebar}
        />
      )}
    </>
  );
}
