import { useEffect, useState } from 'react';
import api from '../services/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: '', unit: '' });
  const [editingId, setEditingId] = useState(null);

  // جلب الموظفين والوحدات
  const fetchEmployees = () =>
    api.get('employees/').then(res => {
      // إضافة اسم الوحدة لكل موظف
    const emps = res.data.map(emp => ({
    ...emp,
    unit_name: units.find(u => u.id === emp.unit)?.name || '—'
    }));
      setEmployees(emps);
    });

  const fetchUnits = () => api.get('units/').then(res => setUnits(res.data));

  useEffect(() => {
    fetchUnits(); // أولًا نجلب الوحدات
  }, []);

  useEffect(() => {
    if (units.length > 0) fetchEmployees(); // بعد جلب الوحدات، نجلب الموظفين
  }, [units]);

  // تغيير الحقول
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // إضافة أو تعديل موظف
const handleSubmit = e => {
  e.preventDefault();

  const payload = {
    name: form.name,
    unit_id: form.unit ? Number(form.unit) : null
  };

  const method = editingId ? api.put : api.post;
  const url = editingId ? `employees/${editingId}/` : 'employees/';

  method(url, payload)
    .then(res => {
      // تعريف empWithUnit هنا داخل then
      const empWithUnit = {
        ...res.data,
        unit_name: res.data.unit?.name || '—'
      };

      if (editingId) {
        setEmployees(prev =>
          prev.map(emp => (emp.id === empWithUnit.id ? empWithUnit : emp))
        );
      } else {
        setEmployees(prev => [...prev, empWithUnit]);
      }

      resetForm();
    })
    .catch(() => alert(editingId ? 'فشل التحديث' : 'فشل الإضافة'));
};


  // تعديل موظف
  const handleEdit = emp => {
  setForm({ name: emp.name, unit: emp.unit_id || (emp.unit ? emp.unit.id : '') });
  setEditingId(emp.id);
  };

  // حذف موظف
  const handleDelete = id => {
    if (window.confirm('هل تريد حذف هذا الموظف؟')) {
      api.delete(`employees/${id}/`)
        .then(() => setEmployees(prev => prev.filter(emp => emp.id !== id)))
        .catch(() => alert('فشل الحذف'));
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setForm({ name: '', unit: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الموظفون</h2>

      {/* نموذج إضافة/تعديل */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow space-y-3">
        <input
          className="border p-2 w-full"
          name="name"
          placeholder="اسم الموظف"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">اختر الوحدة</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

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

      {/* جدول الموظفين */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الوحدة</th>
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-t">
              <td className="p-2">{emp.name}</td>
              <td className="p-2">{emp.unit_name}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(emp)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  تعديل
                </button>
                <button onClick={() => handleDelete(emp.id)} className="bg-red-600 text-white px-2 py-1 rounded">
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
