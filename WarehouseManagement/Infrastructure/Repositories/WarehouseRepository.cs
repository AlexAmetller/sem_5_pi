using Application.Persistence.Repositories;
using Domain.Entities;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class WarehouseRepository : BaseRepository<Warehouse, WarehouseId>, IWarehouseRepository
{
    public WarehouseRepository(EletricGoDbContext context) : base(context.Warehouses) { }

    public async Task<Warehouse> GetByCodeAsync(WarehouseCode code)
    {
        return await this._objs.Where(o => code.Value.Equals(o.Code.Value)).FirstOrDefaultAsync();
    }
}