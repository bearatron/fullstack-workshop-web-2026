import { useState } from "react";
import { itemDetails } from "../starterMenu";

export default function MenuCard({ item, onAdd }) {
  const [showDetails, setShowDetails] = useState(false);
  const soldOut = item.available === false;

  return (
    <article className="card">
      <h2>{item.name}</h2>
      <p className="price">${item.price}</p>
      {soldOut ? <p className="sold-out">SOLD OUT</p> : null}
      <div className="card-actions">
        <button type="button" onClick={() => setShowDetails((current) => !current)}>
          {showDetails ? "Hide details" : "View details"}
        </button>
        <button type="button" onClick={() => onAdd(item)} disabled={soldOut}>
          Add to Order
        </button>
      </div>
      {showDetails ? <p className="details">{itemDetails[item.id]}</p> : null}
    </article>
  );
}
