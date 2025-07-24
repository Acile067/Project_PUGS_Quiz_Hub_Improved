import React, { useEffect, useState } from "react";
import { getActiveLobbies } from "../../services/lobbyService";
import { useNavigate } from "react-router-dom";

const LobbyList = () => {
  const [lobbies, setLobbies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { ok, data } = await getActiveLobbies();
      if (ok) setLobbies(data.lobbies);
    };

    fetchData();
  }, []);

  const handleJoin = (lobbyId) => {
    navigate(`/lobby/join/${lobbyId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Active Lobbies</h2>
      <ul className="space-y-6">
        {lobbies.map((lobby) => (
          <li
            key={lobby.id}
            className="border p-6 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{lobby.name}</p>
              <p>Quiz: {lobby.quizTile}</p>
              <p>
                Starts at:{" "}
                {new Date(lobby.startAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <button
              onClick={() => handleJoin(lobby.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyList;
