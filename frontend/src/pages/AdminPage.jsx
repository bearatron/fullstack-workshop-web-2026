import { useEffect, useState } from "react";
import { fetchMenu, updateMenuItem } from "../api/menu";
import AdminMenuRow from "../components/AdminMenuRow";
import { starterMenu } from "../starterMenu";

export default function AdminPage() {
  const [items, setItems] = useState(starterMenu);

  useEffect(() => {
    let ignore = false;
    fetchMenu()
      .then((menu) => {
        if (!ignore) {
          setItems(menu);
        }
      })
      .catch(() => {
        if (!ignore) {
          setItems(starterMenu);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSave(itemId, body) {
    const updated = await updateMenuItem(itemId, body);
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  }

  return (
    <div className="page">
      <h2 className="page-title">Binary Brews Admin</h2>
      <div className="admin-list">
        {items.map((item) => (
          <AdminMenuRow key={item.id} item={item} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
}
