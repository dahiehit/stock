import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div dir="rtl" className="p-6 text-right">
      <h1 className="text-3xl font-bold mb-6">مرحبًا بك في برنامج الأصول والمخزن للاتحاد</h1>
      <p className="text-gray-600 mb-8">اختر خدمة للبدء في إدارة الموجودات:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/items" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">📦 الاصول</h2>
          <p className="text-sm text-gray-500">إضافة، تعديل، حذف أو عرض الاصول</p>
        </Link>

        <Link to="/locations" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">📍 المواقع</h2>
          <p className="text-sm text-gray-500">إدارة مواقع الاصول</p>
        </Link>

        <Link to="/jarda" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">🔄 الجردة</h2>
          <p className="text-sm text-gray-500">عرض سجل الإدخال والإخراج والتعديلات</p>
        </Link>

        <Link to="/search" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">🔎 البحث</h2>
          <p className="text-sm text-gray-500">تصفية العناصر حسب الاسم، الكمية أو الموقع</p>
        </Link>

        <Link to="/categories" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">🧩 الفئات</h2>
          <p className="text-sm text-gray-500">إدارة فئات الأصول</p>
        </Link>

        <Link to="/units" className="bg-white shadow hover:shadow-md p-6 rounded-lg border text-center">
          <h2 className="text-xl font-semibold mb-2">🛡️ الوحدات</h2>
          <p className="text-sm text-gray-500">إدارة الجهات المستفيدة</p>
        </Link>
      </div>
    </div>
  );
}
