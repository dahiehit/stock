import { useState, useEffect } from 'react';
import movementService from '../services/movementService';
import api from '../services/api';

export default function JardaPage() {
  const [logs, setLogs] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item: '', movement_type: '', quantity: '', performed_by: '', note: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    movementService.getAll().then(res => setLogs(res.data));
    api.get('items/').then(res => setItems(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const action = editingId
      ? movementService.update(editingId, form)
      : movementService.create(form);

    action.then(() => {
      setEditingId(null);
      resetForm();
      movementService.getAll().then(res => setLogs(res.data));
    });
  };

  const handleEdit = (log) => {
    setForm({
      item: log.item,
      movement_type: log.movement_type,
      quantity: log.quantity,
      performed_by: log.performed_by,
      note: log.note
    });
    setEditingId(log.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا السجل؟')) {
      movementService.delete(id).then(() => {
        movementService.getAll().then(res => setLogs(res.data));
      });
    }
  };

  const resetForm = () => {
    setForm({ item: '', movement_type: '', quantity: '', performed_by: '', note: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">حركة الاصول</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <select name="item" value={form.item} onChange={handleChange} className="w-full border p-2">
          <option value="">اختر الاصل</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select name="movement_type" value={form.movement_type} onChange={handleChange} className="w-full border p-2">
          <option value="">نوع الحركة</option>
          <option value="IN">إدخال</option>
          <option value="OUT">إخراج</option>
          <option value="ADJUST">تعديل</option>
        </select>

        <input name="quantity" placeholder="الكمية" value={form.quantity} onChange={handleChange} type="number" className="w-full border p-2" />
        <input name="performed_by" placeholder="تم بواسطة" value={form.performed_by} onChange={handleChange} className="w-full border p-2" />
        <textarea name="note" placeholder="ملاحظات" value={form.note} onChange={handleChange} className="w-full border p-2"></textarea>

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
            <th className="p-2">العنصر</th>
            <th className="p-2">النوع</th>
            <th className="p-2">الكمية</th>
            <th className="p-2">بواسطة</th>
            <th className="p-2">تاريخ</th>
            <th className="p-2">ملاحظات</th>
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{items.find(i => i.id === log.item)?.name || log.item}</td>
              <td className="p-2">
                {log.movement_type === 'IN' ? 'إدخال' :
                 log.movement_type === 'OUT' ? 'إخراج' : 'تعديل'}
              </td>
              <td className="p-2">{log.quantity}</td>
              <td className="p-2">{log.performed_by}</td>
              <td className="p-2">{new Date(log.date).toLocaleDateString()}</td>
              <td className="p-2">{log.note}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(log)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">تعديل</button>
                <button onClick={() => handleDelete(log.id)} className="bg-red-600 text-white px-3 py-1 rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
