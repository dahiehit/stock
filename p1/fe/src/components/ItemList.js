import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('items/')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>المخزون</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} ({item.quantity} {item.unit}) – {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
