namespace Application.Services;

public interface IBaseService<TEntity>
{
    public Task<TEntity> MarkAsInactive(Guid id);
}