using Microsoft.EntityFrameworkCore;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Repository
{
    public class LobyRepository : ILobyRepository
    {
        private readonly AppDbContext _context;
        public LobyRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> CreateLobyAsync(Loby loby, CancellationToken cancellationToken)
        {
            await _context.Lobies.AddAsync(loby, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }

        public async Task<IEnumerable<Loby>> GetAllActiveLobbiesAsync(CancellationToken cancellationToken)
        {            
            return await _context.Lobies
                .Where(l => l.IsActive && l.StartAt >= DateTime.UtcNow)
                .ToListAsync(cancellationToken);
        }
    }
}
