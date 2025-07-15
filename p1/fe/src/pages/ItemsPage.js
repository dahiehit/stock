import { useEffect, useState } from 'react';
import api from '../services/api'; // this points to axios instance

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: '', location: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = () => {
    api.get('items/')
      .then(res => setItems(res.data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchItems();
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
      location: item.location,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا العنصر؟')) {
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
        <input className="border p-2 w-full" name="name" placeholder="اسم الاصل" value={form.name} onChange={handleChange} />
        <input className="border p-2 w-full" name="category" placeholder="الفئة" value={form.category} onChange={handleChange} />
        <input className="border p-2 w-full" name="quantity" type="number" placeholder="الكمية" value={form.quantity} onChange={handleChange} />
        <input className="border p-2 w-full" name="unit" placeholder="الوحدة" value={form.unit} onChange={handleChange} />
        <input className="border p-2 w-full" name="location" placeholder="الموقع (رقم ID)" value={form.location} onChange={handleChange} />
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
              <td className="p-2">{item.location}</td>
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
