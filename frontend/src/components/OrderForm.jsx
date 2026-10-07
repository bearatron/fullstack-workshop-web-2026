import { useState } from "react";
import { createOrder } from "../api/orders";

export default function OrderForm({ items, selectedId, onSelect, onOrdered }) {
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const selected = items.find((item) => item.id === Number(selectedId));
  const selectedUnavailable = selected ? selected.available === false : false;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const order = await createOrder({
        customer_name: customerName,
        menu_item_id: Number(selectedId),
        quantity: Number(quantity),
      });
      onOrdered(order);
      setCustomerName("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Place an order</h2>
      <label>
        Your name
        <input
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
        />
      </label>
      <label>
        Drink
        <select
          value={selectedId}
          onChange={(event) => onSelect(Number(event.target.value))}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id} disabled={item.available === false}>
              {item.name}
              {item.available === false ? " (sold out)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
          {[1, 2, 3, 4].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={selectedUnavailable}>
        Place Order
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
