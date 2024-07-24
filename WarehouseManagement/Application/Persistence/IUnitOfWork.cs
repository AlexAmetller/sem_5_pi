namespace Application.Persistence;

public interface IUnitOfWork
{
    Task<int> CommitAsync();
}