import React, { useEffect, useState } from "react";
import { createLobby, getQuizTitles } from "../../services/lobbyService";

const CreateLobby = () => {
  const [form, setForm] = useState({
    name: "",
    timePreQuestionLimitSeconds: 30,
    quizTitle: "",
    startAt: "",
  });

  const [quizTitles, setQuizTitles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const { ok, data } = await getQuizTitles();
        if (ok) {
          console.log("Quiz titles loaded:", JSON.stringify(data));
          setQuizTitles(data.quizzesTitles || []);
        } else {
          setErrorMessage(data.message || "Failed to load quiz titles");
        }
      } catch (error) {
        console.error("Error loading quiz titles:", error);
        setErrorMessage("Unexpected error occurred while loading titles.");
      }
    };

    fetchTitles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      };

      console.log("Sending payload:", JSON.stringify(payload));

      const { ok, data } = await createLobby(payload);

      if (ok) {
        setSuccessMessage("Lobby successfully created!");
        setErrorMessage("");
        setForm({
          name: "",
          timePreQuestionLimitSeconds: 30,
          quizTitle: "",
          startAt: "",
        });
      } else {
        setSuccessMessage("");
        setErrorMessage(data.message || "Failed to create lobby");
      }
    } catch (err) {
      console.error("Lobby creation error:", err);
      setSuccessMessage("");
      setErrorMessage("Unexpected error occurred while creating the lobby.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Lobby</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Time per question (seconds):
          </label>
          <input
            type="number"
            name="timePreQuestionLimitSeconds"
            value={form.timePreQuestionLimitSeconds}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            min={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Quiz Title:</label>
          <select
            name="quizTitle"
            value={form.quizTitle}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">Select a quiz</option>
            {quizTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Start At:</label>
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Lobby
        </button>

        {successMessage && (
          <p className="text-green-600 font-medium">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-medium">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default CreateLobby;
