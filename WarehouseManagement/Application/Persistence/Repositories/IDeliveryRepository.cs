using Domain.Entities;

namespace Application.Persistence.Repositories;

public interface IDeliveryRepository : IRepository<Delivery, DeliveryId>
{
    public Task<List<Delivery>> GetAllAsyncWithWarehouse();
    public Task<Delivery> GetByCodeAsyncWithWarehouse(DeliveryCode code);
    public Task<Delivery> GetByCodeAsync(DeliveryCode code);
}