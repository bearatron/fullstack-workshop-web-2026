import { useEffect, useState } from "react";

export default function AdminMenuRow({ item, onSave }) {
  const [price, setPrice] = useState(item.price);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPrice(item.price);
  }, [item]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const updated = await onSave(item.id, { price });
      setPrice(updated.price);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }

    // TODO-WORKSHOP-8
    // Add an Available checkbox and send it with the price:
    // const updated = await onSave(item.id, { price, available });

    setSaving(false);
  }

  return (
    <form className="admin-row" onSubmit={handleSave}>
      <h2>{item.name}</h2>
      <label>
        Price
        <input
          value={price}
          inputMode="decimal"
          onChange={(event) => {
            setPrice(event.target.value);
            setSaved(false);
          }}
        />
      </label>
      {/* TODO-WORKSHOP-8
          <label className="check">
            <input type="checkbox" checked={available} onChange={...} />
            Available
          </label>
      */}
      <div className="card-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        {saved ? <p className="saved">Saved</p> : null}
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
