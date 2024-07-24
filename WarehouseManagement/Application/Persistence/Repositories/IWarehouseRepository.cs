using Domain.Entities;

namespace Application.Persistence.Repositories;

public interface IWarehouseRepository : IRepository<Warehouse, WarehouseId>
{
    public Task<Warehouse> GetByCodeAsync(WarehouseCode code);
}