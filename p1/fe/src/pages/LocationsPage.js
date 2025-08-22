import { useEffect, useState } from 'react';
import locationService from '../services/locationService';
import unitService from '../services/unitService';

const LOCATION_TYPE_OPTIONS = [
  { value: 'STORAGE', label: 'مخزن' },
  { value: 'DISTRIBUTION', label: 'موقع توزيع' },
  { value: 'OFFICE', label: 'مكتب' },
  { value: 'HALL', label: 'قاعة' },
  { value: 'OTHER', label: 'آخر' },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    location_type: 'STORAGE',
    unit: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadLocations();
    loadUnits();
  }, []);

  const loadLocations = () => {
    locationService.getAll()
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  };

  const loadUnits = () => {
    unitService.getAll()
      .then(res => setUnits(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = e => {
  e.preventDefault();
  
  const payload = {
    ...form,
    unit_id: form.unit || null,  // <-- هنا نرسل unit_id
  };

  if (editingId) {
    locationService.update(editingId, payload)
      .then(() => {
        resetForm();
        loadLocations();
      })
      .catch(err => console.error(err));
  } else {
    locationService.create(payload)
      .then(() => {
        resetForm();
        loadLocations();
      })
      .catch(err => console.error(err));
  }
};


  const handleEdit = loc => {
    setForm({
      name: loc.name,
      description: loc.description,
      location_type: loc.location_type || 'STORAGE',
      unit: loc.unit?.id || '',
    });
    setEditingId(loc.id);
  };

  const handleDelete = id => {
    if (window.confirm('هل تريد حذف هذا الموقع؟')) {
      locationService.delete(id).then(loadLocations);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', location_type: 'STORAGE', unit: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">المواقع التخزينية</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input
          name="name"
          placeholder="اسم الموقع"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="الوصف"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        ></textarea>

        <select
          name="location_type"
          value={form.location_type}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          {LOCATION_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">اختر الوحدة الإدارية</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
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

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الوصف</th>
            <th className="p-2">نوع الموقع</th>
            <th className="p-2">الوحدة الإدارية</th>
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(loc => (
            <tr key={loc.id} className="border-t">
              <td className="p-2">{loc.name}</td>
              <td className="p-2">{loc.description}</td>
              <td className="p-2">
                {LOCATION_TYPE_OPTIONS.find(opt => opt.value === loc.location_type)?.label || loc.location_type}
              </td>
              <td className="p-2">{loc.unit?.name || '-'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(loc)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  تعديل
                </button>
                <button onClick={() => handleDelete(loc.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
