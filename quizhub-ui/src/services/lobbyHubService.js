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
    // čekaj da konekcija bude u Connected stanju
    if (connection.state !== "Connected") {
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
  } else {
    throw new Error("No SignalR connection available");
  }
};

export const registerUserJoinedHandler = (callback) => {
  userJoinedCallback = callback;
};
