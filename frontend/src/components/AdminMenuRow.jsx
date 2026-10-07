import { useEffect, useState } from "react";

export default function AdminMenuRow({ item, onSave }) {
  const [price, setPrice] = useState(item.price);
  const [available, setAvailable] = useState(item.available);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPrice(item.price);
    setAvailable(item.available);
  }, [item]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const updated = await onSave(item.id, { price, available });
      setPrice(updated.price);
      setAvailable(updated.available);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }

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
      <label className="check">
        <input
          type="checkbox"
          checked={available}
          onChange={(event) => {
            setAvailable(event.target.checked);
            setSaved(false);
          }}
        />
        Available
      </label>
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
