using Application.Persistence;
using Domain.Shared;

namespace Application.Services;

public class BaseService<TEntity, TEntityId>
where TEntity : BaseEntity<TEntityId>
where TEntityId : EntityId
{
    protected readonly IUnitOfWork _uow;

    protected readonly IRepository<TEntity, TEntityId> _repo;

    protected BaseService(IUnitOfWork uow, IRepository<TEntity, TEntityId> repo)
    {
        this._uow = uow;
        this._repo = repo;
    }
}