const API_BASE = "http://localhost:3001";

export async function getBooks() {
  const res = await fetch(`${API_BASE}/books`);
  return res.json();
}

export async function createBook(payload) {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateBook(id, payload) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteBook(id) {
  await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
}
