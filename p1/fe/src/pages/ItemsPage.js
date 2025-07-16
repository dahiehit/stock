import { useEffect, useState } from 'react';
import api from '../services/api'; // axios instance

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]); // لتخزين المواقع
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: '', location: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = () => {
    api.get('items/')
      .then(res => setItems(res.data))
      .catch(err => console.error('Fetch error:', err));
  };

  const fetchLocations = () => {
    api.get('locations/')  // تأكد من أن هذا endpoint صحيح عندك
      .then(res => setLocations(res.data))
      .catch(err => console.error('Locations fetch error:', err));
  };

  useEffect(() => {
    fetchItems();
    fetchLocations();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      api.put(`items/${editingId}/`, form)
        .then(() => {
          fetchItems();
          resetForm();
        })
        .catch(err => alert('Update failed'));
    } else {
      api.post('items/', form)
        .then(() => {
          fetchItems();
          resetForm();
        })
        .catch(err => alert('Create failed'));
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,  // location should be the id here
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا الاصل؟')) {
      api.delete(`items/${id}/`)
        .then(() => fetchItems())
        .catch(err => alert('Delete failed'));
    }
  };

  const resetForm = () => {
    setForm({ name: '', category: '', quantity: '', unit: '', location: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الاصول</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow space-y-3">
        <input className="border p-2 w-full" name="name" placeholder="اسم الاصل" value={form.name} onChange={handleChange} required />
        <input className="border p-2 w-full" name="category" placeholder="الفئة" value={form.category} onChange={handleChange} required />
        <input className="border p-2 w-full" name="quantity" type="number" placeholder="الكمية" value={form.quantity} onChange={handleChange} required />
        <input className="border p-2 w-full" name="unit" placeholder="الوحدة" value={form.unit} onChange={handleChange} required />
        
        {/* حقل اختيار الموقع */}
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="" disabled>اختر الموقع</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        <div className="flex gap-4 justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={resetForm}>
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
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.unit}</td>
              {/* عرض اسم الموقع وليس الـ id */}
              <td className="p-2">{locations.find(loc => loc.id === item.location)?.name || 'غير معروف'}</td>
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
