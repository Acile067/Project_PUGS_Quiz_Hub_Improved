import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;
let userJoinedCallback = null;

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
      console.log("UserJoined:", username);
      if (userJoinedCallback) userJoinedCallback(username);
    });

    await connection.start();
    console.log("SignalR connected.");
  }
};

export const joinLobbyGroup = async (lobbyId) => {
  if (connection) {
    await connection.invoke("JoinLobby", lobbyId);
  }
};

export const registerUserJoinedHandler = (callback) => {
  userJoinedCallback = callback;
};
