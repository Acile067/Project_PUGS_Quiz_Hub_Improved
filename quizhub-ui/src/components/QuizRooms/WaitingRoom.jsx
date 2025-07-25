import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  startLobbyConnection,
  joinLobbyGroup,
  leaveLobbyGroup,
  stopLobbyConnection,
  registerUserJoinedHandler,
  registerUserLeftHandler,
} from "../../services/lobbyHubService";

import {
  joinLobby,
  getParticipantsForLobby,
} from "../../services/lobbyService";

import {
  registerQuestionReceivedHandler,
  registerQuizCompletedHandler,
} from "../../services/lobbyHubService";

const WaitingRoom = () => {
  const { id: lobbyId } = useParams();
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [startAt, setStartAt] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const connect = async () => {
      const { ok } = await joinLobby(lobbyId);
      if (!ok) {
        console.error("Failed to join lobby");
        return;
      }

      await startLobbyConnection(token);
      await joinLobbyGroup(lobbyId);

      try {
        const { usernames, startAt } = await getParticipantsForLobby(lobbyId);
        setJoinedUsers(usernames);
        setStartAt(startAt);
      } catch (err) {
        console.error("Failed to load participants:", err);
      }

      registerUserJoinedHandler((username) => {
        setJoinedUsers((prev) => {
          if (prev.includes(username)) return prev;
          return [...prev, username];
        });
      });

      registerUserLeftHandler((username) => {
        setJoinedUsers((prev) => prev.filter((u) => u !== username));
      });

      registerQuestionReceivedHandler((question) => {
        console.log("Received question:", question);
        setCurrentQuestion(question); // vidi sledeće
      });

      registerQuizCompletedHandler(() => {
        setQuizFinished(true);
      });
    };

    connect();

    return () => {
      leaveLobbyGroup(lobbyId);
      stopLobbyConnection();
    };
  }, [lobbyId]);

  useEffect(() => {
    if (!startAt) return;

    const interval = setInterval(() => {
      const diff = new Date(startAt) - new Date();
      if (diff <= 0) {
        setCountdown("Lobby is starting...");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startAt]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Lobby: {lobbyId}</h2>
      <h3 className="text-xl font-semibold mb-2">Users joined:</h3>
      <ul className="list-disc pl-6 space-y-1">
        {joinedUsers.map((user, index) => (
          <li key={index} className="text-gray-800">
            {user}
          </li>
        ))}
      </ul>
      {countdown && (
        <div className="mb-4 text-lg text-blue-600 font-semibold">
          Lobby starts in: {countdown}
        </div>
      )}
      {currentQuestion && (
        <div className="mt-6 p-4 border rounded shadow bg-white">
          <h3 className="text-xl font-bold mb-2">
            Question {currentQuestion.index}
          </h3>
          <p className="text-gray-800 mb-2">{currentQuestion.text}</p>
          <p className="text-sm text-gray-500 italic">
            Type: {currentQuestion.type}
          </p>
          {/* Možeš dodati Options ovde kad budeš imao podršku */}
        </div>
      )}

      {quizFinished && (
        <div className="mt-6 text-green-600 font-semibold text-xl">
          The quiz has ended. Thank you for participating!
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
