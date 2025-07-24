using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Realtime
{
    [Authorize]
    public class LobbyHub : Hub
    {
        private readonly ILobyRepository _lobyRepository;
        private readonly IUserRepository _userRepository;
        public LobbyHub(ILobyRepository lobyRepository, IUserRepository userRepository)
        {
            _lobyRepository = lobyRepository;
            _userRepository = userRepository;
        }
        public async Task JoinLobby(string lobbyId)
        {
            var lobby = await _lobyRepository.GetLobyByIdAsync(lobbyId);
            if (lobby == null)
            {
                throw new HubException("Lobby not found.");
            }
            if (!lobby.IsActive || lobby.StartAt < DateTime.UtcNow)
            {
                throw new HubException("Lobby is not active or has already started.");
            }

            var username = Context.User?.Identity?.Name ?? "Unknown";
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
            {
                throw new HubException("User not found.");
            }
            if (lobby.Participants.Any(p => p.Id == user.Id))
            {
                throw new HubException("User already in the lobby.");
            }

            lobby.Participants.Add(user);
            await _lobyRepository.UpdateLobyAsync(lobby);

            await Groups.AddToGroupAsync(Context.ConnectionId, lobbyId);

        }

        public async Task LeaveLobby(string lobbyId)
        {
            var username = Context.User?.Identity?.Name ?? "Unknown";
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                throw new HubException("User not found.");
            }
            var lobby = await _lobyRepository.GetLobyByIdAsync(lobbyId);
            if (lobby == null)
            {
                throw new HubException("Lobby not found.");
            }
            if (!lobby.Participants.Any(p => p.Id == user.Id))
            {
                throw new HubException("User not in the lobby.");
            }

            var participantToRemove = lobby.Participants.FirstOrDefault(p => p.Id == user.Id);
            if (participantToRemove != null)
            {
                lobby.Participants.Remove(participantToRemove);
            }

            await _lobyRepository.UpdateLobyAsync(lobby);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobbyId);
            await Clients.Group(lobbyId).SendAsync("UserLeft", username);
        }
    }
}
