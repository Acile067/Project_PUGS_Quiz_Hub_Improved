import React, { useEffect, useState } from "react";
import { getActiveLobbies } from "../../services/lobbyService";

const LobbyList = () => {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    const fetchLobbies = async () => {
      const { ok, data } = await getActiveLobbies();
      if (ok && data.lobbies) {
        setLobbies(data.lobbies);
      } else {
        console.error("Failed to fetch lobbies", data.detail);
      }
    };

    fetchLobbies();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Active Lobbies</h2>
      {lobbies.length === 0 ? (
        <p className="text-gray-600">No active lobbies available.</p>
      ) : (
        <ul className="space-y-6">
          {lobbies.map((lobby) => (
            <li
              key={lobby.id}
              className="border p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {lobby.name}
                </p>
                <p className="text-gray-600">Quiz: {lobby.quizTile}</p>
                <p className="text-gray-500">
                  Starts at:{" "}
                  {new Date(lobby.startAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <button className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 self-end md:self-auto">
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LobbyList;
