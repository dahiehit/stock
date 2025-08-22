import { useEffect, useState } from 'react';
import api from '../services/api';
function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return "—";

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div className="flex items-center gap-2">
      <button onClick={prev} className="px-1 bg-gray-200 rounded">◀</button>
      <img
        src={images[index].image}
        alt="item"
        className="w-16 h-16 object-cover rounded border"
      />
      <button onClick={next} className="px-1 bg-gray-200 rounded">▶</button>
    </div>
  );
}
export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: '',
    location: '',
    notes: '',
    employee: '',
  });

  const [editingId, setEditingId] = useState(null);

  // ======== Fetch Data ========
  const fetchItems = () => api.get('items/').then(res => setItems(res.data));

  const fetchLocations = () =>
    api.get('locations/').then(res => {
      const locs = res.data.map(loc => ({
        ...loc,
        unit_name: loc.unit?.name || '—', // تأكد من وجود وحدة لكل موقع
      }));
      setLocations(locs);
    });

  const fetchUnits = () => api.get('units/').then(res => setUnits(res.data));
  const fetchCategories = () => api.get('categories/').then(res => setCategories(res.data));
  const fetchEmployees = () =>
    api.get('employees/').then(res => {
      const emps = res.data.map(emp => ({
        ...emp,
        unit_name: emp.unit?.name || '—', // تأكد من وجود وحدة لكل موظف
      }));
      setEmployees(emps);
    });

  useEffect(() => {
    fetchItems();
    fetchLocations();
    fetchUnits();
    fetchCategories();
    fetchEmployees();
  }, []);

  // ======== Handlers ========
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("category", form.category);
  formData.append("quantity", form.quantity);
  formData.append("location", form.location);
  formData.append("notes", form.notes);
  formData.append("barcode", form.barcode || "");
  if (form.employee) formData.append("employee_id", form.employee);

  if (form.images) {
    Array.from(form.images).forEach(file => {
      formData.append("images", file);
    });
  }

  const method = editingId ? api.put : api.post;
  const url = editingId ? `items/${editingId}/` : "items/";

  method(url, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then(() => {
      fetchItems();
      resetForm();
    })
    .catch(err => {
      console.error(err.response?.data || err);
      alert(editingId ? "فشل التحديث" : "فشل الإضافة");
    });
};


const handleEdit = item => {
  setForm({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    location: item.location,
    notes: item.notes || '',
    employee: item.employee?.id || '',
    barcode: item.barcode || '',
    images_existing: item.images || [], // ✅ صور موجودة
  });
  setEditingId(item.id);
};

const handleDeleteImage = (imageId) => {
  if (!window.confirm("هل تريد حذف هذه الصورة؟")) return;
  api.delete(`item-images/${imageId}/`)
    .then(() => {
      setForm(prev => ({
        ...prev,
        images_existing: prev.images_existing.filter(img => img.id !== imageId)
      }));
    })
    .catch(() => alert("فشل حذف الصورة"));
};
const handleDelete = (id) => {
  if (!window.confirm("هل تريد حذف هذا الأصل؟")) return;
  api.delete(`items/${id}/`)
    .then(() => fetchItems())
    .catch(() => alert("فشل حذف الأصل"));
};


  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      quantity: '',
      location: '',
      notes: '',
      employee: '',
      barcode: '',   // ✅ لازم نضيفه
      images: null,  // ✅ نعيد الصور
    });
    setEditingId(null);
  };

  // ======== Render ========
  return (
    <div className="p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">الأصول</h2>

      {/* نموذج إضافة / تعديل */}
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

        <select name="location" value={form.location} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">اختر الموقع</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.unit_name})
            </option>
          ))}
        </select>

        <select name="employee" value={form.employee} onChange={handleChange} className="border p-2 w-full">
          <option value="">اختر الموظف</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.unit_name})
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full"
          name="barcode"
          placeholder="الباركود"
          value={form.barcode}
          onChange={handleChange}
        />

        {editingId && form.images_existing && form.images_existing.length > 0 && (
  <div className="flex gap-2 flex-wrap">
    {form.images_existing.map(img => (
      <div key={img.id} className="relative">
        <img
          src={img.image}
          alt="item"
          className="w-16 h-16 object-cover rounded border"
        />
        <button
          type="button"
          onClick={() => handleDeleteImage(img.id)}
          className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

        <input
          type="file"
          multiple
          onChange={e => setForm({ ...form, images: e.target.files })}
          className="border p-2 w-full"
        />


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

      {/* جدول الأصول */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">الاسم</th>
            <th className="p-2">الفئة</th>
            <th className="p-2">الكمية</th>
            <th className="p-2">الموقع</th>
            <th className="p-2">الوحدة الادارية</th>
            <th className="p-2">الموظف</th>
            <th className="p-2">pic</th>
            <th className="p-2">ملاحظات</th>
            <th className="p-2">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const emp = employees.find(e => e.id === item.employee);
            const loc = locations.find(l => l.id === item.location);
            return (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{categories.find(cat => cat.id === item.category)?.name || '—'}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{loc?.name || '—'}</td>
                <td className="p-2">{loc?.unit_name || '—'}</td>
                <td className="p-2">
                  {item.employee ? `${item.employee.name} (${item.employee.unit?.name || '—'})` : '—'}
                </td>
                
                <td className="p-2">
                  <ImageSlider images={item.images} />
                </td>

                
                <td className="p-2">{item.notes || ''}</td>

                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">تعديل</button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-2 py-1 rounded">حذف</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
