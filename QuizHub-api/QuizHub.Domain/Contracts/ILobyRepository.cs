using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface ILobyRepository
    {
        Task<bool> CreateLobyAsync(Loby loby, CancellationToken cancellationToken);
        Task<IEnumerable<Loby>> GetAllActiveLobbiesAsync(CancellationToken cancellationToken);
    }
}
