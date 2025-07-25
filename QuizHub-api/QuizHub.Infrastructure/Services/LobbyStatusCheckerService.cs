/*using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuizHub.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Services
{
    public class LobbyStatusCheckerService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30); // ili minut

        public LobbyStatusCheckerService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var now = DateTime.UtcNow;

                var expiredLobbies = await dbContext.Lobies
                    .Where(l => l.IsActive && l.StartAt <= now)
                    .ToListAsync(stoppingToken);

                foreach (var lobby in expiredLobbies)
                {
                    lobby.IsActive = false;
                }

                await dbContext.SaveChangesAsync(stoppingToken);

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}
*/