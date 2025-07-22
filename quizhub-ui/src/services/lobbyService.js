const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const createLobby = async (lobbyRequest) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/lobby/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lobbyRequest),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};

export const getQuizTitles = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/quiz/get-all-titles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await response.json();
    console.log("Quiz Titles Response", data);
  } catch {
    data = { detail: await response.text() };
  }

  return { ok: response.ok, data };
};
