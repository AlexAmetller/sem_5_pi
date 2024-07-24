using Application.Persistence;

namespace Infrastructure.Shared;

public class UnitOfWork : IUnitOfWork
{
    private readonly EletricGoDbContext _context;

    public UnitOfWork(EletricGoDbContext context)
    {
        _context = context;
    }

    public async Task<int> CommitAsync()
    {
        return await _context.SaveChangesAsync();
    }
}