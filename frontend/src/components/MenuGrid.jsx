import MenuCard from "./MenuCard";

export default function MenuGrid({ items, onAdd }) {
  return (
    <section className="menu-grid" aria-label="Menu">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onAdd={onAdd} />
      ))}
    </section>
  );
}
