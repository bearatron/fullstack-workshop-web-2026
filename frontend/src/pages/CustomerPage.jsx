import { useEffect, useState } from "react";
import { fetchMenu } from "../api/menu";
import MenuGrid from "../components/MenuGrid";
import OrderForm from "../components/OrderForm";
import StatusBanner from "../components/StatusBanner";
import { starterMenu } from "../starterMenu";

export default function CustomerPage() {
  const [items, setItems] = useState(starterMenu);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const [selectedId, setSelectedId] = useState(starterMenu[0].id);

  useEffect(() => {
    let ignore = false;

    async function loadMenu() {
      setLoading(true);
      setError("");
      try {
        const menu = await fetchMenu();
        if (!ignore) {
          setItems(menu);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMenu();
    return () => {
      ignore = true;
    };
  }, []);

  function handleOrdered(order) {
    setLastOrder(order);
    setBanner(`Order placed! ${order.menu_item.name} is now in the queue.`);
  }

  return (
    <div className="page">
      <p className="lede">Order from the counter. The kitchen queue starts here.</p>
      {loading ? <p className="status">Loading menu...</p> : null}
      {error ? <StatusBanner message={error} tone="error" /> : null}
      <MenuGrid items={items} onAdd={(item) => setSelectedId(item.id)} />
      <OrderForm
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onOrdered={handleOrdered}
      />
      <StatusBanner message={banner} tone="success" />
      {lastOrder ? (
        <dl className="order-result">
          <div>
            <dt>Order</dt>
            <dd>{lastOrder.id}</dd>
          </div>
          <div>
            <dt>Drink</dt>
            <dd>{lastOrder.menu_item.name}</dd>
          </div>
          <div>
            <dt>Quantity</dt>
            <dd>{lastOrder.quantity}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{lastOrder.status}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
