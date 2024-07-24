using Domain.Shared;

namespace Domain.Entities;

public class Warehouse : BaseEntity<WarehouseId>, IAggregateRoot
{
    public WarehouseEnabled Enabled { get; set; }
    // Unique, "M01"
    public WarehouseCode Code { get; set; }
    public WarehouseDescription Description { get; set; }
    public WarehouseAddress Address { get; set; }
    public WarehouseCoordinates Coordinates { get; set; }

    public Warehouse(){}
    public Warehouse(WarehouseId id) : base(id){}

    public Warehouse(WarehouseEnabled enabled,
                        WarehouseCode code, 
                        WarehouseDescription description,
                        WarehouseAddress address,
                        WarehouseCoordinates coordinates,
                        WarehouseId id = null)
    {
        this.Id = id ?? new WarehouseId(Guid.NewGuid());
        this.Enabled = enabled;
        this.Code = code;
        this.Description = description;
        this.Address = address;
        this.Coordinates = coordinates;
    }
}