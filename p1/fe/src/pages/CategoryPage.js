// src/pages/CategoryPage.js
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    api.get('categories/').then(res => setCategories(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name };
    if (editingId) {
      api.put(`categories/${editingId}/`, data).then(() => {
        fetch();
        setName('');
        setEditingId(null);
      });
    } else {
      api.post('categories/', data).then(() => {
        fetch();
        setName('');
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد الحذف؟')) {
      api.delete(`categories/${id}/`).then(fetch);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditingId(cat.id);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الفئات</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input className="border p-2 w-full" placeholder="اسم الفئة" value={name} onChange={e => setName(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'تحديث' : 'إضافة'}
        </button>
      </form>
      <ul className="bg-white rounded shadow">
        {categories.map(cat => (
          <li key={cat.id} className="border-b px-4 py-2 flex justify-between">
            <span>{cat.name}</span>
            <div className="space-x-2">
              <button className="bg-yellow-500 text-white px-2 rounded" onClick={() => handleEdit(cat)}>تعديل</button>
              <button className="bg-red-600 text-white px-2 rounded" onClick={() => handleDelete(cat.id)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 