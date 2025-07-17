import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ItemsSearchPage() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    unit: '',
    minQuantity: '',
    maxQuantity: '',
  });

  useEffect(() => {
    api.get('items/').then(res => setItems(res.data)).catch(console.error);
    api.get('locations/').then(res => setLocations(res.data)).catch(console.error);
    api.get('categories/').then(res => setCategories(res.data)).catch(console.error);
    api.get('units/').then(res => setUnits(res.data)).catch(console.error);
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredItems = items.filter(item => {
    const category = categories.find(c => c.id === item.category);
    const unit = units.find(u => u.id === item.unit);
    const location = locations.find(l => l.id === item.location);

    const searchText = filters.search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      (item.notes || '').toLowerCase().includes(searchText) ||
      (category?.name || '').toLowerCase().includes(searchText) ||
      (unit?.name || '').toLowerCase().includes(searchText) ||
      (location?.name || '').toLowerCase().includes(searchText);

    const matchesLocation = !filters.location || item.location === parseInt(filters.location);
    const matchesCategory = !filters.category || item.category === parseInt(filters.category);
    const matchesUnit = !filters.unit || item.unit === parseInt(filters.unit);
    const matchesMin = !filters.minQuantity || item.quantity >= parseInt(filters.minQuantity);
    const matchesMax = !filters.maxQuantity || item.quantity <= parseInt(filters.maxQuantity);

    return matchesSearch && matchesLocation && matchesCategory && matchesUnit && matchesMin && matchesMax;
  });

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">البحث في الأصول</h2>

      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input
          className="border p-2 w-full"
          name="search"
          placeholder="بحث حر (الاسم، الملاحظات، الفئة، الوحدة، الموقع)"
          value={filters.search}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="location" value={filters.location} onChange={handleChange} className="border p-2 w-full">
            <option value="">كل المواقع</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <select name="category" value={filters.category} onChange={handleChange} className="border p-2 w-full">
            <option value="">كل الفئات</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select name="unit" value={filters.unit} onChange={handleChange} className="border p-2 w-full">
            <option value="">كل الوحدات</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              className="border p-2 w-full"
              name="minQuantity"
              type="number"
              placeholder="الحد الأدنى للكمية"
              value={filters.minQuantity}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full"
              name="maxQuantity"
              type="number"
              placeholder="الحد الأقصى للكمية"
              value={filters.maxQuantity}
              onChange={handleChange}
            />
          </div>
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
            <th className="p-2">ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => {
            const category = categories.find(c => c.id === item.category);
            const unit = units.find(u => u.id === item.unit);
            const location = locations.find(l => l.id === item.location);

            return (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{category?.name || '—'}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{unit?.name || '—'}</td>
                <td className="p-2">{location?.name || '—'}</td>
                <td className="p-2">{item.notes || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
