import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', quantity: '', unit: '', location: '', notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = () => api.get('items/').then(res => setItems(res.data));
  const fetchLocations = () => api.get('locations/').then(res => setLocations(res.data));
  const fetchUnits = () => api.get('units/').then(res => setUnits(res.data));
  const fetchCategories = () => api.get('categories/').then(res => setCategories(res.data));

  useEffect(() => {
    fetchItems();
    fetchLocations();
    fetchUnits();
    fetchCategories();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = editingId ? api.put : api.post;
    const url = editingId ? `items/${editingId}/` : 'items/';
    method(url, form)
      .then(() => {
        fetchItems();
        resetForm();
      })
      .catch(err => alert(editingId ? 'فشل التحديث' : 'فشل الإضافة'));
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      notes: item.notes || ''
    });
    setEditingId(item.id);
  };

  const handleDelete = id => {
    if (window.confirm('هل تريد حذف هذا الأصل؟')) {
      api.delete(`items/${id}/`)
        .then(fetchItems)
        .catch(() => alert('فشل الحذف'));
    }
  };

  const resetForm = () => {
    setForm({ name: '', category: '', quantity: '', unit: '', location: '', notes: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الأصول</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow space-y-3">
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="اسم الأصل"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">اختر الفئة</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          className="border p-2 w-full"
          name="quantity"
          type="number"
          placeholder="الكمية"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <select name="unit" value={form.unit} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">اختر الوحدة</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select name="location" value={form.location} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">اختر الموقع</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        {/* ✅ حقل الملاحظات */}
        <textarea
          className="border p-2 w-full"
          name="notes"
          placeholder="ملاحظات"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="flex gap-4 justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              إلغاء
            </button>
          )}
        </div>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الفئة</th>
            <th className="p-2">الكمية</th>
            <th className="p-2">الوحدة</th>
            <th className="p-2">الموقع</th>
            <th className="p-2">ملاحظات</th>
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{categories.find(cat => cat.id === item.category)?.name || '—'}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{units.find(u => u.id === item.unit)?.name || '—'}</td>
              <td className="p-2">{locations.find(loc => loc.id === item.location)?.name || '—'}</td>
              <td className="p-2">{item.notes || ''}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">تعديل</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-2 py-1 rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
