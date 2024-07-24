using Application.Persistence.Repositories;
using Domain.Entities;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class DeliveryRepository : BaseRepository<Delivery, DeliveryId>, IDeliveryRepository
{
    public DeliveryRepository(EletricGoDbContext context) : base(context.Deliveries) { }

    public async Task<List<Delivery>> GetAllAsyncWithWarehouse()
    {
        return await this._objs.Include(b => b.DestinationWarehouse).ToListAsync();
    }

    public async Task<Delivery> GetByCodeAsync(DeliveryCode code)
    {
        return await this._objs.Where(o => code.Value.Equals(o.Code.Value)).FirstOrDefaultAsync();
    }

    public async Task<Delivery> GetByCodeAsyncWithWarehouse(DeliveryCode code)
    {
        return await this._objs.Where(o => code.Value.Equals(o.Code.Value)).Include(b => b.DestinationWarehouse).FirstOrDefaultAsync();
    }
}