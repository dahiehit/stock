import { useEffect, useState } from 'react';
import api from '../services/api'; // Your Axios instance

export default function ItemsSearchPage() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minQuantity: '',
    maxQuantity: '',
  });

  useEffect(() => {
    api.get('items/')
      .then(res => setItems(res.data))
      .catch(err => console.error('Fetch items error:', err));

    api.get('locations/')
      .then(res => setLocations(res.data))
      .catch(err => console.error('Fetch locations error:', err));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.includes(filters.search) ||
      item.category.includes(filters.search);

    const matchesLocation =
      !filters.location || item.location === parseInt(filters.location);

    const matchesMin = !filters.minQuantity || item.quantity >= parseInt(filters.minQuantity);
    const matchesMax = !filters.maxQuantity || item.quantity <= parseInt(filters.maxQuantity);

    return matchesSearch && matchesLocation && matchesMin && matchesMax;
  });

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">البحث في الأصول</h2>

      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          name="search"
          placeholder="بحث بالاسم أو الفئة"
          value={filters.search}
          onChange={handleChange}
        />

        <select
          name="location"
          className="border p-2 w-full"
          value={filters.location}
          onChange={handleChange}
        >
          <option value="">كل المواقع</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <input
            className="border p-2 w-full"
            name="minQuantity"
            type="number"
            placeholder="أقل كمية"
            value={filters.minQuantity}
            onChange={handleChange}
          />
          <input
            className="border p-2 w-full"
            name="maxQuantity"
            type="number"
            placeholder="أقصى كمية"
            value={filters.maxQuantity}
            onChange={handleChange}
          />
        </div>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الفئة</th>
            <th className="p-2">الكمية</th>
            <th className="p-2">الوحدة</th>
            <th className="p-2">الموقع</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.unit}</td>
              <td className="p-2">{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
