import { useEffect, useState } from 'react';
import api from '../services/api';

export default function UnitPage() {
  const [units, setUnits] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    api.get('units/').then(res => setUnits(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name };
    if (editingId) {
      api.put(`units/${editingId}/`, data).then(() => {
        fetch();
        setName('');
        setEditingId(null);
      });
    } else {
      api.post('units/', data).then(() => {
        fetch();
        setName('');
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد الحذف؟')) {
      api.delete(`units/${id}/`).then(fetch);
    }
  };

  const handleEdit = (unit) => {
    setName(unit.name);
    setEditingId(unit.id);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الوحدات</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input className="border p-2 w-full" placeholder="اسم الوحدة" value={name} onChange={e => setName(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'تحديث' : 'إضافة'}
        </button>
      </form>
      <ul className="bg-white rounded shadow">
        {units.map(unit => (
          <li key={unit.id} className="border-b px-4 py-2 flex justify-between">
            <span>{unit.name}</span>
            <div className="space-x-2">
              <button className="bg-yellow-500 text-white px-2 rounded" onClick={() => handleEdit(unit)}>تعديل</button>
              <button className="bg-red-600 text-white px-2 rounded" onClick={() => handleDelete(unit.id)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
