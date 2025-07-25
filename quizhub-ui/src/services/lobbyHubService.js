import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;
let connectedLobbyId = null;
let userJoinedCallback = null;
let userLeftCallback = null;
let questionReceivedCallback = null;
let quizCompletedCallback = null;

export const registerQuestionReceivedHandler = (callback) => {
  questionReceivedCallback = callback;
};

export const registerQuizCompletedHandler = (callback) => {
  quizCompletedCallback = callback;
};

export const registerUserLeftHandler = (callback) => {
  userLeftCallback = callback;
};

export const startLobbyConnection = async (token) => {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_BACKEND_API_URL}/hubs/lobby`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("UserJoined", (username) => {
      if (userJoinedCallback) userJoinedCallback(username);
    });

    connection.on("UserLeft", (username) => {
      if (userLeftCallback) userLeftCallback(username);
    });

    connection.on("ReceiveQuestion", (question) => {
      if (questionReceivedCallback) questionReceivedCallback(question);
    });

    connection.on("QuizCompleted", () => {
      if (quizCompletedCallback) quizCompletedCallback();
    });

    await connection.start();
    console.log("SignalR connected.");
  }
};

export const joinLobbyGroup = async (lobbyId) => {
  if (connectedLobbyId === lobbyId) return; // već si u grupi

  if (connection?.state !== "Connected") {
    await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (connection.state === "Connected") {
          clearInterval(interval);
          resolve();
        } else if (connection.state === "Disconnected") {
          clearInterval(interval);
          reject(new Error("Connection disconnected"));
        }
      }, 50);
    });
  }

  await connection.invoke("JoinLobby", lobbyId);
  connectedLobbyId = lobbyId;
};

export const registerUserJoinedHandler = (callback) => {
  userJoinedCallback = callback;
};

export const leaveLobbyGroup = async (lobbyId) => {
  if (connection) {
    await connection.invoke("LeaveLobby", lobbyId);
    connectedLobbyId = null;
    userJoinedCallback = null;
    userLeftCallback = null;
  }
};

export const stopLobbyConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
    userJoinedCallback = null;
    userLeftCallback = null;
  }
};
