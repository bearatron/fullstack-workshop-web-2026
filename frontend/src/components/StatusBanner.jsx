export default function StatusBanner({ message, tone }) {
  if (!message) {
    return null;
  }
  return <p className={`banner banner-${tone || "info"}`}>{message}</p>;
}
