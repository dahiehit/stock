import { useEffect, useState } from 'react';
import itemService from '../services/itemService';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: '', location: '' });
  const [editingId, setEditingId] = useState(null);

  const loadItems = () => {
    itemService.getAll()
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      itemService.update(editingId, form).then(() => {
        setEditingId(null);
        setForm({ name: '', category: '', quantity: '', unit: '', location: '' });
        loadItems();
      });
    } else {
      itemService.create(form).then(() => {
        setForm({ name: '', category: '', quantity: '', unit: '', location: '' });
        loadItems();
      });
    }
  };

  const handleEdit = item => {
    setEditingId(item.id);
    setForm(item);
  };

  const handleDelete = id => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      itemService.delete(id).then(loadItems);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">العناصر</h1>

      <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded shadow mb-4">
        <input name="name" placeholder="اسم العنصر" value={form.name} onChange={handleChange} className="w-full p-2 border" />
        <input name="category" placeholder="الفئة" value={form.category} onChange={handleChange} className="w-full p-2 border" />
        <input name="quantity" placeholder="الكمية" value={form.quantity} onChange={handleChange} type="number" className="w-full p-2 border" />
        <input name="unit" placeholder="الوحدة" value={form.unit} onChange={handleChange} className="w-full p-2 border" />
        <input name="location" placeholder="رقم الموقع" value={form.location} onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'تحديث' : 'إضافة'}
        </button>
      </form>

      <table className="w-full bg-white shadow rounded overflow-hidden text-right">
        <thead className="bg-gray-200">
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
