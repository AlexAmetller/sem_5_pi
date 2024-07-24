using Domain.Shared;

namespace Domain.Entities;

public class Delivery : BaseEntity<DeliveryId>, IAggregateRoot
{
    public DeliveryCode Code { get; set; }
    public DateTime Date { get; set; }
    public double Mass { get; set; }
    public int LoadingTime { get; set; }
    public int WithdrawingTime { get; set; }
    public WarehouseId DestinationWarehouseId { get; set; }
    public virtual Warehouse DestinationWarehouse { get; set; }

    public Delivery() {}

    public Delivery(DeliveryCode code, DateTime date, double mass, int loadingTime, int withdrawingTime, WarehouseId destinationWarehouseId, DeliveryId id = null)
    {
        this.Id = id ?? new DeliveryId(Guid.NewGuid());
        this.Code = code;
        this.Date = date;
        this.Mass = mass;
        this.DestinationWarehouseId = destinationWarehouseId;
        this.LoadingTime = loadingTime;
        this.WithdrawingTime = withdrawingTime;
    }
}