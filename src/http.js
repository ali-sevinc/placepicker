export async function fetchPlaces(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Ops.. Something went wrong...");
  }
  const data = await res.json();
  return data.places;
}

export async function updateUserPlaces(places) {
  const res = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(places),
  });
  if (!res.ok) throw new Error("Failed update user data..");
  const data = await res.json();
  return data.message;
}
