export async function fetchMenu() {
  const response = await fetch("/api/menu/");
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Could not load the menu");
  }
  return response.json();
}

export async function updateMenuItem(id, body) {
  const response = await fetch(`/api/admin/menu/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-KEY": "binary-brews-demo",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not update the menu item");
  }
  return data;
}
