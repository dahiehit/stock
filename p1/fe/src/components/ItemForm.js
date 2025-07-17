import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ItemForm() {
  const [form, setForm] = useState({
    name: '', category: '', quantity: '', unit: '', location: '',  notes: '',  // ✅ أضف هذا

  });

  const [locations, setLocations] = useState([]);
  const categories = ['أثاث', 'معدات', 'أجهزة إلكترونية', 'قرطاسية'];

  useEffect(() => {
    api.get('locations/')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('items/', form)
      .then(() => alert('تمت الإضافة!'))
      .catch(err => console.error(err));
  };

  return (
<form onSubmit={handleSubmit} dir="rtl" style={{ textAlign: 'right' }}>
  <input name="name" placeholder="اسم العنصر" onChange={handleChange} />
  
  <select name="category" onChange={handleChange}>
    <option value="">-- اختر الفئة --</option>
    {categories.map((cat, i) => (
      <option key={i} value={cat}>{cat}</option>
    ))}
  </select>

  <input name="quantity" type="number" placeholder="الكمية" onChange={handleChange} />
  
  <input name="unit" placeholder="الوحدة" onChange={handleChange} />

  <select name="location" onChange={handleChange}>
    <option value="">-- اختر الموقع --</option>
    {locations.map(loc => (
      <option key={loc.id} value={loc.id}>{loc.name}</option>
    ))}
  </select>

  {/* ✅ ملاحظات */}
  <textarea
    name="notes"
    placeholder="ملاحظات"
    value={form.notes}
    onChange={handleChange}
  />

  <button type="submit">إضافة</button>
</form>

  );
}
