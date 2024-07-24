using Application.Persistence;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class BaseRepository<TEntity, TEntityId> : IRepository<TEntity, TEntityId>
where TEntity : BaseEntity<TEntityId>
where TEntityId : EntityId
{
    protected readonly DbSet<TEntity> _objs;

    public BaseRepository(DbSet<TEntity> objs)
    {
        this._objs = objs;
    }

    public async Task<TEntity> AddAsync(TEntity obj)
    {
        var ret = await this._objs.AddAsync(obj);

        return ret.Entity;
    }

    public async Task<List<TEntity>> GetAllAsync()
    {
        return await this._objs.ToListAsync();
    }

    public async Task<TEntity> GetByIdAsync(TEntityId id)
    {
        return await this._objs.Where(o => id.Equals(o.Id)).FirstOrDefaultAsync();
    }

    public async Task<List<TEntity>> GetByIdsAsync(List<TEntityId> ids)
    {
        return await this._objs.Where(o => ids.Contains(o.Id)).ToListAsync();
    }

    public void Remove(TEntity obj)
    {
        this._objs.Remove(obj);
    }

    public async Task<bool> RemoveById(TEntityId id)
    {
        var obj = await this.GetByIdAsync(id);

        if (obj == null)
            return false;

        this.Remove(obj);

        return true;
    }
}